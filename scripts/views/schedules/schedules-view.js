/******************************************************************************\
|                                                                              |
|                                   schedules-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing run request schedules.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/schedules/schedules.tpl',
	'collections/run-requests/run-requests',
	'views/base-view',
	'views/schedules/filters/schedule-filters-view',
	'views/schedules/list/schedules-list-view'
], function($, _, Template, RunRequests, BaseView, ScheduleFiltersView, SchedulesListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			filters: '#schedule-filters',
			list: '#schedules-list'
		},

		events: {
			'click #add-new-schedule': 'onClickAddNewSchedule',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new RunRequests();

			// parse list of assessment run uuids
			//
			if (this.options.selectedAssessmentRunUuids) {
				this.selectedAssessmentRunUuids = this.options.selectedAssessmentRunUuids.split('+');
			}
		},

		//
		// querying methods
		//

		getQueryString: function() {
			return this.getChildView('filters').getQueryString();
		},

		getFilterData: function() {
			return this.getChildView('filters').getData();
		},
		
		getTitle: function() {
			var project = this.options.data.project;
			if (project) {
				if (project.isTrialProject()) {
					return 'My Schedules';
				} else {
					return '<span class="name">' + project.get('full_name') + '</span>' + ' Schedules';
				}
			} else {
				return 'Schedules';
			}
		},

		//
		// ajax methods
		//

		fetchProjectSchedules: function(project, done) {
			var self = this;

			// fetch schedules for a single project
			//
			this.collection.fetchByProject(project, {
				data: this.getChildView('filters').getAttrs(),

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get run requests for this project."
					});
				}
			});
		},

		fetchProjectsSchedules: function(projects, done) {
			var self = this;

			// fetch schedules for multiple projects
			//
			this.collection.fetchByProjects(projects, {
				data: this.getChildView('filters').getAttrs(),

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get run requests for all projects."
					});
				}
			});
		},

		fetchSchedules: function(done) {
			if (this.options.data.project) {

				// fetch schedules for a single project
				//
				this.fetchProjectSchedules(this.options.data.project, done);
			} else if (this.options.data.projects) {

				// fetch schedules for multiple projects
				//
				this.fetchProjectsSchedules(this.options.data.projects, done);
			} else {

				// fetch schedules for trial project
				//
				if (this.model) {
					this.fetchProjectSchedules(this.model, done);
				} else {
					done();
				}
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.getTitle(),
				project: this.options.data.project,
				showGrouping: application.options.showGrouping
			};
		},

		onRender: function() {
			var self = this;

			// show schedule filters view
			//
			this.showFilters();

			// fetch and show schedules list
			//
			this.fetchAndShowList();
		},

		showFilters: function() {
			var self = this;
			
			// show schedule filters view
			//
			this.showChildView('filters', new ScheduleFiltersView({
				model: this.model,
				data: this.options.data? this.options.data : {},

				// callbacks
				//
				onChange: function() {
					// setQueryString(self.getChildView('filters').getQueryString());			
				
					// update filter data
					//
					var projects = self.options.data.projects;
					self.options.data = self.getFilterData();
					self.options.data.projects = projects;

					// update url
					//
					var queryString = self.getQueryString();
					var state = window.history.state;
					var url = getWindowBaseLocation() + (queryString? ('?' + queryString) : '');
					window.history.pushState(state, '', url);

					// update view
					//
					self.onChange();
				}
			}));
		},

		fetchAndShowList: function() {
			var self = this;
			this.fetchSchedules(function(schedules) {
				self.showList();
			});
		},
		
		showList: function() {

			// preserve existing sorting column and order
			//
			if (this.getChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			// show schedules list view
			//
			this.showChildView('list', new SchedulesListView({
				project: this.options.data.project,
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				selectedAssessmentRunUuids: this.options.selectedAssessmentRunUuids,
				showProjects: application.session.user.hasProjects(),
				showDelete: true
			}));
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update title
			//
			this.$el.find('#title').html(this.getTitle());

			// update list
			//
			this.fetchAndShowList();
		},

		onClickAddNewSchedule: function() {
			
			// go to add schedule view
			//
			application.navigate('#run-requests/schedules/add');
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		},

		onClickShowGrouping: function(event) {
			application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		}
	});
});