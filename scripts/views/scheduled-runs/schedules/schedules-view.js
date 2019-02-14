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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/scheduled-runs/schedules/schedules.tpl',
	'registry',
	'collections/run-requests/run-requests',
	'views/dialogs/error-view',
	'views/scheduled-runs/schedules/filters/schedule-filters-view',
	'views/scheduled-runs/schedules/list/schedules-list-view'
], function($, _, Backbone, Marionette, Template, Registry, RunRequests, ErrorView, ScheduleFiltersView, SchedulesListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			scheduleFilters: '#schedule-filters',
			schedulesList: '#schedules-list'
		},

		events: {
			'click #add-new-schedule': 'onClickAddNewSchedule',
			'click #show-numbering': 'onClickShowNumbering',
			'click #cancel': 'onClickCancel',
		},

		//
		// methods
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
			return this.scheduleFilters.currentView.getQueryString();
		},

		getFilterData: function() {
			return this.scheduleFilters.currentView.getData();
		},

		//
		// ajax methods
		//

		fetchProjectSchedules: function(project, done) {
			var self = this;

			// fetch schedules for a single project
			//
			this.collection.fetchByProject(project, {
				data: this.scheduleFilters.currentView.getAttrs(),

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get run requests for this project."
						})
					);
				}
			});
		},

		fetchProjectsSchedules: function(projects, done) {
			var self = this;

			// fetch schedules for multiple projects
			//
			this.collection.fetchByProjects(projects, {
				data: this.scheduleFilters.currentView.getAttrs(),

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get run requests for all projects."
						})
					);
				}
			});
		},

		fetchSchedules: function(done) {
			if (this.options.data['project']) {

				// fetch schedules for a single project
				//
				this.fetchProjectSchedules(this.options.data['project'], done);
			} else if (this.options.data['projects']) {

				// fetch schedules for multiple projects
				//
				this.fetchProjectsSchedules(this.options.data['projects'], done);
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				project: this.options.data['project'],
				showNumbering: Registry.application.options.showNumbering
			}));
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
			this.scheduleFilters.show(
				new ScheduleFiltersView({
					model: this.model,
					data: this.options.data? this.options.data : {},

					// callbacks
					//
					onChange: function() {
						// setQueryString(self.scheduleFilters.currentView.getQueryString());			
					
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
				})
			);
		},

		showList: function() {

			// show schedules list view
			//
			this.schedulesList.show(
				new SchedulesListView({
					project: this.options.data['project'],
					collection: this.collection,
					selectedAssessmentRunUuids: this.options.selectedAssessmentRunUuids,
					showProjects: Registry.application.session.user.get('has_projects'),
					showNumbering: Registry.application.options.showNumbering,
					showDelete: true
				})
			);
		},

		fetchAndShowList: function() {
			var self = this;
			this.fetchSchedules(function(schedules) {
				self.showList();
			});
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update list
			//
			this.fetchAndShowList();
		},

		onClickAddNewSchedule: function() {
			var queryString = this.getQueryString();
			
			// go to add schedule view
			//
			Backbone.history.navigate('#run-requests/schedules/add' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		},

		onClickCancel: function() {
			var queryString = this.getQueryString();

			// return to run requests view
			//
			Backbone.history.navigate('#run-requests' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		}
	});
});