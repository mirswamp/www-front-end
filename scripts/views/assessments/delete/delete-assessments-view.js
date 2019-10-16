/******************************************************************************\
|                                                                              |
|                             delete-assessments-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for running or scheduling assessments.          |
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
	'text!templates/assessments/delete/delete-assessments.tpl',
	'models/projects/project',
	'models/run-requests/run-request',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/base-view',
	'views/assessments/filters/assessment-filters-view',
	'views/assessments/select-list/select-assessments-list-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Template, Project, RunRequest, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, BaseView, AssessmentFiltersView, SelectAssessmentsListView, VersionFilterSelectorView) {
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
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #reset-filters': 'onClickResetFilters',
			'click input[name="select"], input.select-all': 'onClickInputSelect',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping',
			'click #delete': 'onClickDelete',
			'click #done': 'onClickDone'
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

		getShortTitle: function() {
			var project = this.options.data['project'];
			if (project) {
				if (project.isTrialProject()) {
					return 'My Assessments';
				} else {
					return project.get('full_name') + ' Assessments';
				}
			} else {
				return 'Assessments';
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

		//
		// button enabling / disabling methods
		//
		
		enableButtons: function() {
			this.$el.find('#delete').prop('disabled', false);
		},

		disableButtons: function() {
			this.$el.find('#delete').prop('disabled', true);
		},

		configureButtons: function() {

			// enable buttons if one or more checkboxes is checked
			//
			if (this.$el.find('input[name="select"]:checked').length != 0) {
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
			if (this.options.data['project']) {

				// fetch assessments for a single project
				//
				this.fetchProjectAssessments(this.options.data['project'], done);
			} else if (this.options.data['projects'] && this.options.data['projects'].length > 0) {

				// fetch assessments for multiple projects
				//
				this.fetchProjectsAssessments(this.options.data['projects'], done);
			} else {

				// no project
				//
				done(this.collection);
			}
		},

		//
		// query string / filter methods
		//

		getQueryString: function() {
			var queryString = this.getChildView('filters').getQueryString();
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
				shortTitle: this.getShortTitle(),
				showNavigation: Object.keys(this.options.data).length > 0,
				showProjects: application.session.user.get('has_projects'),
				showNumbering: application.options.showNumbering,
				showGrouping: application.options.showGrouping
			};
		},

		onRender: function() {

			// show assessments filters
			//
			this.showFilters();

			// show assessments list
			//
			this.fetchAndShowList();
		},

		showFilters: function() {
			var self = this;

			// show assessment results filters view
			//
			this.showChildView('filters', new AssessmentFiltersView({
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
				self.configureButtons();
			});
		},

		showList: function() {

			// preserve existing sorting order
			//
			if (this.hasChildView('list') && this.collection.length > 0) {
				this.options.sortList = this.getChildView('list').getSortList();
			}
			
			// show select assessments list view
			//
			this.showChildView('list', new SelectAssessmentsListView({
				model: this.model,
				collection: this.collection,
				sortList: this.options.sortList,
				selectedAssessments: this.options.selectedAssessments,
				showProjects: application.session.user.get('has_projects'),
				showNumbering: application.options.showNumbering,
				showGrouping: application.options.showGrouping,
				showDelete: true
			}));
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
			this.getChildView('filters').reset();
		},

		onClickInputSelect: function() {
			this.configureButtons();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		},

		onClickShowGrouping: function(event) {
			application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		},

		onClickDelete: function() {
			var self = this;
			var selectedAssessments = this.getChildView('list').getSelected();

			if (selectedAssessments.length > 0) {
				var message;

				if (selectedAssessments.length > 1) {
					message = "Are you sure that you would like to delete these " + selectedAssessments.length + " assessments?";
				} else {
					message = "Are you sure that you would like to delete this assessment.";
				}

				// show confirmation
				//
				application.confirm({
					title: "Delete Assessments",
					message: message,

					// callbacks
					//
					accept: function() {
						selectedAssessments.destroy({

							// callbacks
							//
							success: function() {

								// update list of assessments
								//
								self.showList();
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not delete assessments."
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
			var selectedAssessments = this.getChildView('list').getSelected();
			var self = this;
			
			require([
				'views/assessments/assessments-view'
			], function (AssessmentsView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'assessments', 

					// callbacks
					//
					done: function(view) {

						// show project assessments view
						//
						view.showChildView('content', new AssessmentsView({
							data: self.options.data,
							model: view.model,
							selectedAssessments: selectedAssessments
						}));
					}
				});
			});
		}
	});
});