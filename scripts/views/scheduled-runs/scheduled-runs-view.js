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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/scheduled-runs/scheduled-runs.tpl',
	'registry',
	'models/projects/project',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/dialogs/error-view',
	'views/scheduled-runs/filters/scheduled-runs-filters-view',
	'views/scheduled-runs/list/scheduled-runs-list-view',
	'views/scheduled-runs/lists/scheduled-runs-lists-view'
], function($, _, Backbone, Marionette, Template, Registry, Project, AssessmentRuns, ExecutionRecords, ScheduledRuns, ErrorView, ScheduledRunsFiltersView, ScheduledRunsListView, ScheduledRunsListsView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			scheduledRunsFilters: '#scheduled-runs-filters',
			scheduledRunsLists: '#scheduled-runs-lists'
		},

		events: {
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #add-new-scheduled-runs': 'onClickAddNewScheduledRuns',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-schedules': 'onClickShowSchedules'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new ScheduledRuns();
		},

		//
		// querying methods
		//

		getShortTitle: function() {
			var project = this.options.data['project'];
			if (project) {
				if (project.isTrialProject()) {
					return 'My Scheduled Runs';
				} else {
					return project.get('short_name') + ' Scheduled Runs';
				}
			} else {
				return 'Scheduled Runs';
			}
		},

		getTitle: function() {
			var title = this.getShortTitle();
			var package = this.options.data['package'];
			var packageVersion = this.options.data['package-version'];
			var tool = this.options.data['tool'];
			var toolVersion = this.options.data['tool-version'];
			var platform = this.options.data['platform'];
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
			return this.scheduledRunsFilters.currentView.getQueryString();
		},

		getFilterData: function() {
			return this.scheduledRunsFilters.currentView.getData();
		},

		getFilterAttrs: function() {
			return this.scheduledRunsFilters.currentView.getAttrs();
		},

		//
		// ajax methods
		//

		fetchProjectScheduledRuns: function(project, done) {
			var self = this;

			// fetch scheduled runs for a project
			//
			this.collection.fetchByProject(this.options.data['project'], {

				// attributes
				//
				data: this.getFilterAttrs(['package', 'tool', 'platform', 'limit']),

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get scheduled runs for this project."
						})
					);
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get scheduled runs for all projects."
						})
					);
				}
			});
		},

		fetchScheduledRuns: function(done) {
			if (this.options.data['project']) {

				// fetch scheduled runs for a project
				//
				this.fetchProjectScheduledRuns(this.options.data['project'], done);
			} else if (this.options.data['projects'] && this.options.data['projects'].length > 0) {

				// fetch scheduled runs for multiple projects
				//
				this.fetchProjectsScheduledRuns(this.options.data['projects'], done);
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				title: this.getTitle(),
				shortTitle: this.getShortTitle(),
				showNavigation: Object.keys(this.options.data).length > 0,
				showNumbering: Registry.application.options.showNumbering
			}));
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
			this.scheduledRunsFilters.show(
				new ScheduledRunsFiltersView({
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
				})
			);
		},

		fetchAndShowLists: function() {
			var self = this;
			this.fetchScheduledRuns(function() {
				self.showLists();
			});
		},

		showList: function() {
			this.scheduledRunsList.show(
				new ScheduledRunsListView({
					collection: this.collection,
					showNumbering: Registry.application.options.showNumbering,
					showDelete: true,
					parent: this
				})
			);
		},

		showLists: function() {
			this.scheduledRunsLists.show(
				new ScheduledRunsListsView({
					collection: this.collection.getByRunRequests(this.collection.getRunRequests()),
					showNumbering: Registry.application.options.showNumbering,
					showDelete: true,
					parent: this
				})
			);
		},

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
		
		addBadges: function() {
			var self = this;

			// add num assessments badge
			//
			if (this.options.data['project']) {
				AssessmentRuns.fetchNumByProject(this.options.data['project'], {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#assessments", number);
					}
				});
			} else if (this.options.data['projects'] && this.options.data['projects'].length > 0) {
				AssessmentRuns.fetchNumByProjects(this.options.data['projects'], {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#assessments", number);
					}
				});
			} else {
				this.addBadge("#assessments", 0);
			}

			// add num results badge
			//
			if (this.options.data['project']) {
				ExecutionRecords.fetchNumByProject(this.options.data['project'], {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#results", number);
					}
				});
			} else if (this.options.data['projects'] && this.options.data['projects'].length > 0) {
				ExecutionRecords.fetchNumByProjects(this.options.data['projects'], {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#results", number);
					}
				});
			} else {
				this.addBadge("#results", 0);
			}
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

			// update titles
			//
			this.$el.find('#title').html(this.getTitle());
			this.$el.find('#breadcrumb').html(this.getShortTitle());

			// update list
			//
			this.fetchAndShowLists();

			// update badges
			//
			this.addBadges();
		},

		onClickAssessments: function() {
			var queryString = this.getQueryString();

			// go to assessments view
			//
			Backbone.history.navigate('#assessments' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		},

		onClickResults: function() {
			var queryString = this.getQueryString();
			
			// go to assessment results view
			//
			Backbone.history.navigate('#results' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		},

		onClickAddNewScheduledRuns: function() {
			var queryString = this.getQueryString();
			
			// go to my assessments view
			//
			Backbone.history.navigate('#assessments' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showLists();
		},

		onClickShowSchedules: function() {
			var queryString = this.getQueryString();

			// go to my schedules view
			//
			Backbone.history.navigate('#run-requests/schedules' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});		
		}
	});
});