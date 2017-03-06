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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/assessment-results/delete/delete-assessments-results.tpl',
	'registry',
	'config',
	'models/projects/project',
	'models/run-requests/run-request',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/assessment-results/assessment-runs/filters/assessment-runs-filters-view',
	'views/assessment-results/assessment-runs/select-list/select-assessment-runs-list-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Backbone, Marionette, Template, Registry, Config, Project, RunRequest, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, ConfirmView, NotifyView, ErrorView, AssessmentRunsFiltersView, SelectAssessmentRunsListView, VersionFilterSelectorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//
		refreshInterval: 10000,

		regions: {
			assessmentRunsFilters: '#assessment-runs-filters',
			assessmentRunsList: '#assessment-runs-list'
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

		getShortTitle: function() {
			var project = this.options.data['project'];
			if (project) {
				if (project.isTrialProject()) {
					return 'My Assessment Results';
				} else {
					return project.get('short_name') + ' Assessment Results';
				}
			} else {
				return 'Assessment Results';
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
			if (this.assessmentRunsList.currentView) {
				return this.assessmentRunsList.currentView.getSelected();
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
			} else if (this.options.data['project']) {
				return this.options.data['project'].get('project_uid');

			// use default project
			//
			} else {
				return this.model.get('project_uid');
			}
		},

		//
		// query string / filter methods
		//

		getQueryString: function() {
			return this.assessmentRunsFilters.currentView.getQueryString();
		},

		getFilterData: function(attributes) {
			return this.assessmentRunsFilters.currentView.getData(attributes);
		},

		getFilterAttrs: function(attributes) {
			return this.assessmentRunsFilters.currentView.getAttrs(attributes);
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get execution records for this project."
						})
					);
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get execution records for these projects."
						})
					);
				}
			});
		},

		fetchExecutionRecords: function(done) {
			if (this.options.data['project']) {

				// fetch execution records for a single project
				//
				this.fetchProjectExecutionRecords(this.options.data['project'], done);
			} else if (this.options.data['projects'] && this.options.data['projects'].length > 0) {

				// fetch execution records for multiple projects
				//
				this.fetchProjectsExecutionRecords(this.options.data['projects'], done);
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				title: this.getTitle(),
				shortTitle: this.getShortTitle(),
				showNavigation: Object.keys(this.options.data).length > 0,
				viewers: this.options.viewers,
				showNumbering: Registry.application.options.showNumbering,
				showGrouping: Registry.application.options.showGrouping,
				autoRefresh: Registry.application.options.autoRefresh
			}));
		},

		onRender: function() {

			// show assessments results filters
			//
			this.showFilters();

			// show assessments runs list and schedule refresh
			//
			this.fetchAndShowList();
		},

		showFilters: function() {
			var self = this;
			
			// show assessment results filters view
			//
			this.assessmentRunsFilters.show(
				new AssessmentRunsFiltersView({
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
				})
			);
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
			var selected = this.getSelected();

			// preserve existing sorting order
			//
			if (this.assessmentRunsList.currentView && this.collection.length > 0) {
				this.options.sortList = this.assessmentRunsList.currentView.getSortList();
			}
			
			// show assessment runs list view
			//
			this.assessmentRunsList.show(
				new SelectAssessmentRunsListView({
					model: this.model,
					collection: this.collection,
					viewer: this.options.viewer,
					viewers: this.options.viewers,
					selectedExecutionRecords: this.options.selectedExecutionRecords,
					errorViewer: this.options.viewers.getNative(),
					selected: selected,
					sortList: this.options.sortList,
					queryString: this.getQueryString(),
					editable: true,
					showNumbering: Registry.application.options.showNumbering,
					showGrouping: Registry.application.options.showGrouping,
					showStatus: true,
					showErrors: true,
					showDelete: true,
					showSsh: true
				})
			);
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update titles
			//
			this.$el.find('#title').html(this.getTitle());
			this.$el.find('#breadcrumb').html(this.getShortTitle());

			// update list
			//
			this.fetchAndShowList();
		},

		onClickResetFilters: function() {
			this.assessmentRunsFilters.currentView.reset();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		},

		onClickShowGrouping: function(event) {
			Registry.application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		},

		onClickDelete: function() {
			var self = this;
			var selectedExecutionRecords = this.assessmentRunsList.currentView.getSelected();

			if (selectedExecutionRecords.length > 0) {

				if (selectedExecutionRecords.length > 1) {
					var message = "Are you sure that you would like to delete these " + selectedExecutionRecords.length + " assessment results?";
				} else {
					var message = "Are you sure that you would like to delete this assessment result?";
				}

				// show confirm dialog
				//
				Registry.application.modal.show(
					new ConfirmView({
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

									// show error dialog
									//
									Registry.application.modal.show(
										new ErrorView({
											message: "Could not delete assessment results."
										})
									);
								}
							});
						}
					})
				);
			} else {

				// show no assessments selected notify view
				//
				Registry.application.modal.show(
					new NotifyView({
						message: "No assessments were selected.  To delete an assessment, please select at least one item from the list of assessments."
					})
				);
			}
		},

		onClickDone: function() {
			var selectedExecutionRecords = this.getSelected();
			var self = this;
			
			require([
				'views/assessment-results/assessments-results-view'
			], function (AssessmentsResultsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'results', 

					// callbacks
					//
					done: function(view) {

						// show assessments results view
						//
						view.content.show(
							new AssessmentsResultsView({
								data: self.options.data,
								model: view.model,
								viewers: self.options.viewers,
								selectedExecutionRecords: selectedExecutionRecords
							})
						);
					}
				});
			});	
		}
	});
});
