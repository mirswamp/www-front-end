/******************************************************************************\
|                                                                              |
|                          add-scheduled-runs-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for scheduling assessments.                     |
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
	'text!templates/scheduled-runs/add/add-scheduled-runs.tpl',
	'models/projects/project',
	'models/run-requests/run-request',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'collections/run-requests/run-requests',
	'views/base-view',
	'views/scheduled-runs/filters/add-scheduled-runs-filters-view',
	'views/assessments/select-list/select-assessments-list-view',
	'views/assessments/dialogs/confirm-run-request-dialog-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Template, Project, RunRequest, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, RunRequests, BaseView, AddScheduledRunsFiltersView, SelectAssessmentsListView, ConfirmRunRequestDialogView, VersionFilterSelectorView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			filters: '#assessment-filters',
			list: '#select-assessments-list'
		},

		events: {
			'click #assessments': 'onClickAssessments',
			'click #schedules': 'onClickSchedules',
			'click #runs': 'onClickRuns',
			'click #reset-filters': 'onClickResetFilters',
			'click #schedule-assessments': 'onClickScheduleAssessments',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;

			// set attributes
			//
			this.collection = new AssessmentRuns();
		},

		//
		// querying methods
		//

		getProjectTitle: function() {
			var project = this.options.data.project;
			if (project) {
				if (project.isTrialProject()) {
					return 'Add New My Scheduled Runs';
				} else {
					return 'Add New ' + '<span class="name">' + project.get('full_name') + '</span>' + ' Scheduled Runs';
				}
			} else {
				return 'Add New Scheduled Runs';
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
				title += '&nbsp;';
				title += '<span class="name">' + VersionFilterSelectorView.getVersionString(packageVersion).toTitleCase() + '</span>';
			}

			// add tool info
			//
			if (tool) {
				title += ' Using ' + '<span class="name">' + tool.get('name') + '</span>';
			}
			if (toolVersion) {
				title += '&nbsp;';
				title += '<span class="name">' + VersionFilterSelectorView.getVersionString(toolVersion).toTitleCase() + '</span>';
			}

			// add platform info
			//
			if (platform) {
				title += ' on ' + '<span class="name">' + platform.get('name') + '</span>';
			}
			if (platformVersion) {
				title += '&nbsp;';
				title += '<span class="name">' + VersionFilterSelectorView.getVersionString(platformVersion).toTitleCase() + '</span>';
			}

			return title;
		},

		hasSelected: function() {
			return this.$el.find('.select input:checked').length != 0;
		},

		//
		// button enabling / disabling methods
		//
		
		enableButtons: function() {
			this.$el.find('#schedule-assessments').prop('disabled', false);
		},

		disableButtons: function() {
			this.$el.find('#schedule-assessments').prop('disabled', true);
		},

		updateButtons: function() {

			// enable buttons if one or more checkboxes is checked
			//
			if (this.hasSelected()) {
				this.enableButtons();
			} else {
				this.disableButtons();
			}
		},

		//
		// ajax methods
		//

		fetchProjectAssessments: function(project, done) {
			var self = this;

			// fetch assessments for a single project
			//
			this.collection.fetchByProject(project, {

				// attributes
				//
				data: this.getFilterAttrs(['package', 'tool', 'platform', 'limit']),

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get assessments for this project."
					});
				}
			});
		},

		fetchProjectsAssessments: function(projects, done) {
			var self = this;

			// fetch assessments for multiple projects
			//
			this.collection.fetchByProjects(projects, {

				// attributes
				//
				data: this.getFilterAttrs(['package', 'tool', 'platform', 'limit']),

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get assessments for all projects."
					});
				}
			});
		},

		fetchAssessments: function(done) {
			if (this.options.data.project) {

				// fetch assessments for a single project
				//
				this.fetchProjectAssessments(this.options.data.project, done);
			} else {

				// fetch assessments for trial project
				//
				if (this.model) {
					this.fetchProjectAssessments(this.model, done);
				} else {
					done();
				}
			}
		},

		scheduleOneTimeRunRequests: function(assessmentRuns, notifyWhenComplete) {
			var self = this;
			var runRequest = new RunRequest();

			// save run requests
			//
			runRequest.saveOneTimeRunRequests(assessmentRuns.getUuids(), notifyWhenComplete, {

				// callbacks
				//
				success: function() {

					// go to runs / results view
					//								
					application.navigate('#results');
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save collection of run request assocs."
					});		
				}
			});
		},

		//
		// query string / filter methods
		//

		getQueryString: function() {
			return this.getChildView('filters').getQueryString();
		},

		getProjectQueryString: function() {
			return this.getChildView('filters').getChildView('project').getQueryString();
		},

		getSelectedQueryString: function() {
			var queryString = this.getProjectQueryString();
			var selectedAssessments = this.getChildView('list').getSelected();

			if (selectedAssessments.length > 0) {
				queryString = addQueryString(queryString, 'assessments=' + selectedAssessments.getUuidsStr());
			}

			return queryString;
		},

		getFilterData: function(attributes) {
			return this.getChildView('filters').getData(attributes);
		},

		getFilterAttrs: function(attributes) {
			return this.getChildView('filters').getAttrs(attributes);
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.getTitle(),
				showNavigation: Object.keys(this.options.data).length > 0,
				showGrouping: application.options.showGrouping,
				queryString: getQueryString()
			};
		},

		onRender: function() {

			// show assessments filters
			//
			this.showFilters();

			// show assessments list
			//
			this.fetchAndShowList();

			// add count bubbles / badges
			//
			this.addBadges();
		},

		showFilters: function() {
			var self = this;

			// show scheduled runs filters view
			//
			this.showChildView('filters', new AddScheduledRunsFiltersView({
				model: this.model,
				data: this.options.data,

				// callbacks
				//
				onChange: function() {
					//setQueryString(self.getQueryString());

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
			this.fetchAssessments(function() {

				// show assessments list
				//
				self.showList();

				// enable / disable buttons
				//
				self.updateButtons();
			});
		},

		showList: function() {
			var self = this;

			// preserve existing sorting column and order
			//
			if (this.hasChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			// show select assessments list view
			//
			this.showChildView('list', new SelectAssessmentsListView({
				model: this.model,
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				selectedAssessments: this.options.selectedAssessments,
				showProjects: application.session.user.hasProjects(),
				showGrouping: application.options.showGrouping,
				showDelete: false,

				// callbacks
				//
				onSelect: function() {
					self.updateButtons();
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

		addNumRunsBadge: function() {
			var self = this;
			if (this.options.data.project) {
				ScheduledRuns.fetchNumByProject(this.options.data.project, {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#runs", number);
					}
				});
			} else if (this.options.data.projects && this.options.data.projects.length > 0) {
				ScheduledRuns.fetchNumByProjects(this.options.data.projects, {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#runs", number);
					}
				});
			} else {
				this.addBadge("#runs", 0);
			}			
		},

		addBadges: function() {
			this.addNumAssessmentsBadge();
			this.addNumSchedulesBadge();
			this.addNumRunsBadge();
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

			// update badges
			//
			this.addBadges();
		},

		//
		// navigation mouse event handling methods
		//

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

		onClickRuns: function() {

			// go to run requests view
			//
			application.navigate('#run-requests');
		},

		//
		// mouse event handling methods
		//

		onClickResetFilters: function() {
			this.getChildView('filters').reset();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		},

		onClickShowGrouping: function(event) {
			application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		},

		onClickScheduleAssessments: function() {
			var self = this;

			// prompt user to select a project first
			//
			/*
			if (!this.options.data.project) {

				// show select project notification
				//
				application.notify({
					message: "No project was selected.  To schedule an assessment, please select a project (or no project) from the project filter."
				});

				return;
			}
			*/

			var selectedAssessments = this.getChildView('list').getSelected();
			if (selectedAssessments.length > 0) {
				var queryString = this.getSelectedQueryString();

				// go to run requests schedule view
				//
				application.navigate('#run-requests/schedule' + (queryString != ''? '?' + queryString : ''));	
			} else {

				// show no assessments selected notify view
				//
				application.notify({
					message: "No assessments were selected.  To schedule an assessment, please select at least one item from the list of assessments."
				});
			}
		},

		onClickCancel: function() {

			// go to scheduled runs view
			//
			application.navigate('#run-requests');
		}
	});
});