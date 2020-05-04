/******************************************************************************\
|                                                                              |
|                        delete-assessments-results-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a project's current list of         |
|        assessment runs and results.                                          |
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
	'text!templates/results/delete/delete-assessments-results.tpl',
	'models/projects/project',
	'models/run-requests/run-request',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/base-view',
	'views/results/assessment-runs/filters/assessment-runs-filters-view',
	'views/results/assessment-runs/select-list/select-assessment-runs-list-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Template, Project, RunRequest, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, BaseView, AssessmentRunsFiltersView, SelectAssessmentRunsListView, VersionFilterSelectorView) {
	return BaseView.extend({

		//
		// attributes
		//
		refreshInterval: 10000,

		template: _.template(Template),

		regions: {
			filters: '#assessment-runs-filters',
			list: '#assessment-runs-list'
		},

		events: {
			'click #reset-filters': 'onClickResetFilters',
			'click #view-results': 'onClickViewResults',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping',
			'click #delete': 'onClickDelete',
			'click #done': 'onClickDone'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new ExecutionRecords();
		},

		//
		// querying methods
		//

		getProjectTitle: function() {
			var project = this.options.data.project;
			if (project) {
				if (project.isTrialProject()) {
					return 'My Assessment Results';
				} else {
					return project.get('full_name') + ' Assessment Results';
				}
			} else {
				return 'Assessment Results';
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
		
		getSelected: function() {
			if (this.getChildView('list')) {
				return this.getChildView('list').getSelected();
			}
		},

		getAssesmentRunProjectUuid: function() {
			var executionRecords = this.getSelected();

			// check if some assessment runs are selected
			//
			if (executionRecords.length > 0) {

				// use project from first checked run
				//
				return executionRecords.toArray()[0].get('project_uuid');

			// check if a project filter is selected
			//
			} else if (this.options.data.project) {
				return this.options.data.project.get('project_uid');

			// use default project
			//
			} else {
				return this.model.get('project_uid');
			}
		},

		hasSelected: function() {
			return this.$el.find('.select input:checked').length != 0;
		},

		//
		// query string / filter methods
		//

		getQueryString: function() {
			return this.getChildView('filters').getQueryString();
		},

		getFilterData: function(attributes) {
			return this.getChildView('filters').getData(attributes);
		},

		getFilterAttrs: function(attributes) {
			return this.getChildView('filters').getAttrs(attributes);
		},

		//
		// ajax methods
		//

		fetchProjectExecutionRecords: function(project, done) {
			var self = this;

			// fetch execution records for a single project
			//
			this.collection.fetchByProject(project, {

				// attributes
				//
				data: this.getFilterAttrs(['package', 'tool', 'platform', 'date', 'limit']),

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get execution records for this project."
					});
				}
			});
		},

		fetchProjectsExecutionRecords: function(projects, done) {
			var self = this;

			// fetch execution records for multiple projects
			//
			this.collection.fetchByProjects(projects, {

				// attributes
				//
				data: this.getFilterAttrs(['package', 'tool', 'platform', 'date', 'limit']),

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get execution records for these projects."
					});
				}
			});
		},

		fetchExecutionRecords: function(done) {
			if (this.options.data.project) {

				// fetch execution records for a single project
				//
				this.fetchProjectExecutionRecords(this.options.data.project, done);
			} else if (this.options.data.projects && this.options.data.projects.length > 0) {

				// fetch execution records for multiple projects
				//
				this.fetchProjectsExecutionRecords(this.options.data.projects, done);
			} else {

				// fetch execution records for trial project
				//
				if (this.model) {
					this.fetchProjectExecutionRecords(this.model, done);
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
				viewers: this.options.viewers,

				// options
				//
				showProjects: application.session.user.hasProjects(),
				showGrouping: application.options.showGrouping,
				autoRefresh: application.options.autoRefresh
			};
		},

		onRender: function() {
			var self = this;

			// show assessments results filters
			//
			this.showFilters();

			// show assessments runs list and schedule refresh
			//
			this.fetchAndShowList(function() {

				// set initial state of buttons
				//
				self.updateDeleteButton();			
			});
		},

		showFilters: function() {
			var self = this;
			
			// show assessment results filters view
			//
			this.showChildView('filters', new AssessmentRunsFiltersView({
				model: this.model,
				data: this.options.data,

				// callbacks
				//
				onChange: function() {
					// setQueryString(self.getQueryString());

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

		fetchAndShowList: function(done) {
			var self = this;
			
			// fetch execution records
			//
			this.fetchExecutionRecords(function() {

				// show list
				//
				self.showList();

				// perform callback
				//
				if (done) {
					done();
				}
			});
		},

		showList: function() {
			var self = this;
			var selected = this.getSelected();

			// preserve existing sorting column and order
			//
			if (this.getChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}
			
			// show assessment runs list view
			//
			this.showChildView('list', new SelectAssessmentRunsListView({
				model: this.model,
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				viewer: this.options.viewer,
				viewers: this.options.viewers,
				selectedExecutionRecords: this.options.selectedExecutionRecords,
				errorViewer: this.options.viewers.getNative(),
				selected: selected,
				queryString: this.getQueryString(),
				editable: true,
				showProjects: application.session.user.hasProjects(),
				showGrouping: application.options.showGrouping,
				showStatus: true,
				showErrors: true,
				showDelete: true,
				showSsh: true,

				// callbacks
				//
				onSelect: function() {
					self.updateDeleteButton();
				}
			}));
		},

		updateDeleteButton: function() {

			// enable delete buttons if one or more checkboxes is checked
			//
			if (this.hasSelected()) {
				this.$el.find('#delete').prop('disabled', false);
			} else {
				this.$el.find('#delete').prop('disabled', true);
			}
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

		onClickDelete: function() {
			var self = this;
			var selectedExecutionRecords = this.getChildView('list').getSelected();

			if (selectedExecutionRecords.length > 0) {
				var message;

				if (selectedExecutionRecords.length > 1) {
					message = "Are you sure that you would like to delete these " + selectedExecutionRecords.length + " assessment results?";
				} else {
					message = "Are you sure that you would like to delete this assessment result?";
				}

				// show confirmation
				//
				application.confirm({
					title: "Delete Assessment Results",
					message: message,

					// callbacks
					//
					accept: function() {
						selectedExecutionRecords.destroy({

							// callbacks
							//
							success: function() {

								// update list of assessment runs
								//
								self.showList();
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not delete assessment results."
								});
							}
						});
					}
				});
			} else {

				// show no assessments selected notify view
				//
				application.notify({
					message: "No assessments were selected.  To delete an assessment, please select at least one item from the list of assessments."
				});
			}
		},

		onClickDone: function() {
			var self = this;
			var selectedExecutionRecords = this.getSelected();
			
			// preserve existing sorting column and order
			//
			if (this.getChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			require([
				'views/results/assessments-results-view'
			], function (AssessmentsResultsView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'results', 

					// callbacks
					//
					done: function(view) {

						// show assessments results view
						//
						view.showChildView('content', new AssessmentsResultsView({
							model: view.model,

							// options
							//
							sortBy: self.options.sortBy,
							data: self.options.data,
							viewers: self.options.viewers,
							selectedExecutionRecords: selectedExecutionRecords
						}));
					}
				});
			});	
		}
	});
});
