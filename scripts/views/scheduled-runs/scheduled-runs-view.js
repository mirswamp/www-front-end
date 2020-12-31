/******************************************************************************\
|                                                                              |
|                              scheduled-runs-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a project's current list of.        |
|        scheduled assessment runs.                                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/scheduled-runs/scheduled-runs.tpl',
	'models/projects/project',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'collections/run-requests/run-requests',
	'views/base-view',
	'views/scheduled-runs/filters/scheduled-runs-filters-view',
	'views/scheduled-runs/list/scheduled-runs-list-view',
	'views/scheduled-runs/lists/scheduled-runs-lists-view'
], function($, _, Template, Project, AssessmentRuns, ExecutionRecords, ScheduledRuns, RunRequests, BaseView, ScheduledRunsFiltersView, ScheduledRunsListView, ScheduledRunsListsView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),	

		regions: {
			filters: '#scheduled-runs-filters',
			lists: '#scheduled-runs-lists'
		},

		events: {
			'click #assessments': 'onClickAssessments',
			'click #schedules': 'onClickSchedules',
			'click #add-new-scheduled-runs': 'onClickAddNewScheduledRuns',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new ScheduledRuns();
		},

		//
		// querying methods
		//

		getProjectTitle: function() {
			var project = this.options.data.project;
			if (project) {
				if (project.isTrialProject()) {
					return 'My Scheduled Runs';
				} else {
					return '<span class="name">' + project.get('full_name') + '</span>' + ' Scheduled Runs';
				}
			} else {
				return 'Scheduled Runs';
			}
		},

		getTitle: function() {
			var title = this.getProjectTitle();
			var package = this.options.data.package;
			var packageVersion = this.options.data['package-version'];
			var tool = this.options.data.tool;
			var toolVersion = this.options.data['tool-version'];
			var platform = this.options.data.platform;
			var platformVersion = this.options.data['platform-version'];

			// add package info
			//
			if (package) {
				title += ' of ' + '<span class="name">' + package.get('name') + '</span>';
			}
			if (packageVersion) {
				title += ' Version ' + '<span class="name">' + (typeof packageVersion == 'string'? packageVersion.toTitleCase() : packageVersion.get('version_string')) + '</span>';
			}

			// add tool info
			//
			if (tool) {
				title += ' Using ' + '<span class="name">' + tool.get('name') + '</span>';
			}
			if (toolVersion) {
				title += ' Version ' + '<span class="name">' + (typeof toolVersion == 'string'? toolVersion.toTitleCase() : toolVersion.get('version_string')) + '</span>';
			}

			// add platform info
			//
			if (platform) {
				title += ' on ' + '<span class="name">' + platform.get('name') + '</span>';
			}
			if (platformVersion) {
				title += ' Version ' + '<span class="name">' + (typeof platformVersion == 'string'? platformVersion.toTitleCase() : platformVersion.get('version_string')) + '</span>';
			}

			return title;
		},

		getQueryString: function() {
			return this.getChildView('filters').getQueryString();
		},

		getFilterData: function() {
			return this.getChildView('filters').getData();
		},

		getFilterAttrs: function() {
			return this.getChildView('filters').getAttrs();
		},

		//
		// ajax methods
		//

		fetchProjectScheduledRuns: function(project, done) {
			var self = this;

			// fetch scheduled runs for a project
			//
			this.collection.fetchByProject(this.options.data.project, {

				// attributes
				//
				data: this.getFilterAttrs(['package', 'tool', 'platform', 'limit']),

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get scheduled runs for this project."
					});
				}
			});
		},

		fetchProjectsScheduledRuns: function(projects, done) {
			var self = this;

			// fetch scheduled runs for multiple projects
			//
			this.collection.fetchByProjects(projects, {

				// attributes
				//
				data: this.getFilterAttrs(['package', 'tool', 'platform', 'limit']),

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get scheduled runs for all projects."
					});
				}
			});
		},

		fetchScheduledRuns: function(done) {
			if (this.options.data.project) {

				// fetch scheduled runs for a project
				//
				this.fetchProjectScheduledRuns(this.options.data.project, done);
			} else if (this.options.data.projects && this.options.data.projects.length > 0) {

				// fetch scheduled runs for multiple projects
				//
				this.fetchProjectsScheduledRuns(this.options.data.projects, done);
			} else {

				// fetch scheduled runs for trial project
				//
				if (this.model) {
					this.fetchProjectScheduledRuns(this.model, done);
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
				showNavigation: Object.keys(this.options.data).length > 0,
				showGrouping: application.options.showGrouping
			};
		},

		onRender: function() {
			
			// show run requests filters view
			//
			this.showFilters();

			// fetch and show run requests
			//
			this.fetchAndShowLists();

			// add count bubbles / badges
			//
			this.addBadges();
		},

		showFilters: function() {
			var self = this;
			this.showChildView('filters', new ScheduledRunsFiltersView({
				model: this.model,
				data: this.options.data,

				// callbacks
				//
				onChange: function() {
					// setQueryString(self.getQueryString());

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

		fetchAndShowLists: function() {
			var self = this;
			this.fetchScheduledRuns(function() {
				self.showLists();
			});
		},

		showList: function() {

			// preserve existing sorting column and order
			//
			if (this.getChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			this.showChildView('list', new ScheduledRunsListView({
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				showProjects: application.session.user.hasProjects(),
				showGrouping: application.options.showGrouping,
				showDelete: true,
				parent: this
			}));
		},

		showLists: function() {
			var self = this;

			// preserve existing sorting column and order
			//
			if (this.getChildView('lists') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('lists').getSorting();
			}

			this.showChildView('lists', new ScheduledRunsListsView({
				collection: this.collection.getRunRequests(),

				// options
				//
				sortBy: this.options.sortBy,
				scheduledRuns: this.collection,
				showProjects: application.session.user.hasProjects(),
				showGrouping: application.options.showGrouping,
				showDelete: true,
				parent: this,

				// callbacks
				//
				onDelete: function() {
					self.fetchAndShowLists();
				}
			}));
		},

		//
		// badge rendering methods
		//

		addBadge: function(selector, num) {
			var element = this.$el.find(selector)[0];
			if (element) {
				if ($(element).find('.badge').length == 0) {

					// append badge
					//
					if (num > 0) {
						$(element).append('<span class="badge">' + num + '</span>');
					} else {
						$(element).append('<span class="badge badge-important">' + num + '</span>');
					}
				} else {

					// change badge
					//
					if (num > 0) {
						$(element).find('.badge').replaceWith('<span class="badge">' + num + '</span>');
					} else {
						$(element).find('.badge').replaceWith('<span class="badge badge-important">' + num + '</span>');
					}
				}
			}
		},
		
		addNumAssessmentsBadge: function() {
			var self = this;
			if (this.options.data.project) {
				AssessmentRuns.fetchNumByProject(this.options.data.project, {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#assessments", number);
					}
				});
			} else if (this.options.data.projects && this.options.data.projects.length > 0) {
				AssessmentRuns.fetchNumByProjects(this.options.data.projects, {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#assessments", number);
					}
				});
			} else {
				this.addBadge("#assessments", 0);
			}
		},

		addNumSchedulesBadge: function() {
			var self = this;
			if (this.options.data.project) {
				RunRequests.fetchNumSchedulesByProject(this.options.data.project, {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#schedules", number);
					}
				});
			} else if (this.options.data.projects && this.options.data.projects.length > 0) {
				RunRequests.fetchNumSchedulesByProjects(this.options.data.projects, {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#schedules", number);
					}
				});
			} else {
				this.addBadge("#results", 0);
			}		
		},

		addBadges: function() {
			this.addNumAssessmentsBadge();
			this.addNumSchedulesBadge();
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update filter data
			//
			var projects = this.options.data.projects;
			this.options.data = this.getFilterData();
			this.model = this.options.data.project;
			this.options.data.projects = projects;

			// update title
			//
			this.$el.find('#title').html(this.getTitle());

			// update list
			//
			this.fetchAndShowLists();

			// update badges
			//
			this.addBadges();
		},

		onClickAssessments: function() {

			// go to assessments view
			//
			application.navigate('#assessments');
		},

		onClickSchedules: function() {

			// go to my schedules view
			//
			application.navigate('#run-requests/schedules');		
		},

		onClickAddNewScheduledRuns: function() {
			
			// go to add run requests view
			//
			application.navigate('#run-requests/add');
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		},

		onClickShowGrouping: function(event) {
			application.setShowGrouping($(event.target).is(':checked'));
			this.showLists();
		}
	});
});