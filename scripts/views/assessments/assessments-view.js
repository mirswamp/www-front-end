/******************************************************************************\
|                                                                              |
|                                 assessments-view.js                          |
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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/assessments/assessments.tpl',
	'registry',
	'models/projects/project',
	'models/run-requests/run-request',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/assessments/filters/assessment-filters-view',
	'views/assessments/select-list/select-assessments-list-view',
	'views/assessments/dialogs/confirm-run-request-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Backbone, Marionette, Template, Registry, Project, RunRequest, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, NotifyView, ErrorView, AssessmentFiltersView, SelectAssessmentsListView, ConfirmRunRequestView, VersionFilterSelectorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			assessmentFilters: '#assessment-filters',
			selectAssessmentsList: '#select-assessments-list'
		},

		events: {
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #reset-filters': 'onClickResetFilters',
			'click #run-assessments': 'onClickRunAssessments',
			'click #run-new-assessment': 'onClickRunNewAssessment',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping',
			'click #schedule-assessments': 'onClickScheduleAssessments',
			'click #delete-assessments': 'onClickDeleteAssessments',
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
					return project.get('short_name') + ' Assessments';
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
			this.$el.find('#run-assessments').prop('disabled', false);
			this.$el.find('#schedule-assessments').prop('disabled', false);
		},

		disableButtons: function() {
			this.$el.find('#run-assessments').prop('disabled', true);
			this.$el.find('#schedule-assessments').prop('disabled', true);
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get assessments for this project."
						})
					);
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get assessments for all projects."
						})
					);
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

					// show success notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "Your assessment run has been started.",

							// callbacks
							//
							accept: function() {
								var queryString = self.getQueryString();

								// go to runs / results view
								//								
								Backbone.history.navigate('#results' + (queryString != ''? '?' + queryString : ''), {
									trigger: true
								});
							}
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save collection of run request assocs."
						})
					);		
				}
			});
		},

		//
		// query string / filter methods
		//

		getQueryString: function() {
			return this.assessmentFilters.currentView.getQueryString();
		},

		getSelectedQueryString: function() {
			var queryString = this.getQueryString();
			var selectedAssessments = this.selectAssessmentsList.currentView.getSelected();

			if (selectedAssessments.length > 0) {
				queryString = addQueryString(queryString, 'assessments=' + selectedAssessments.getUuidsStr());
			}

			return queryString;
		},

		getFilterData: function(attributes) {
			return this.assessmentFilters.currentView.getData(attributes);
		},

		getFilterAttrs: function(attributes) {
			return this.assessmentFilters.currentView.getAttrs(attributes);
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				title: this.getTitle(),
				shortTitle: this.getShortTitle(),
				showNavigation: Object.keys(this.options.data).length > 0,
				showNumbering: Registry.application.options.showNumbering,
				showGrouping: Registry.application.options.showGrouping
			}));
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

			// show assessment results filters view
			//
			this.assessmentFilters.show(
				new AssessmentFiltersView({
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
				})
			);
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
			var self = this;

			// preserve existing sorting order
			//
			if (this.selectAssessmentsList.currentView && this.collection.length > 0) {
				this.options.sortList = this.selectAssessmentsList.currentView.getSortList();
			}

			// show select assessments list view
			//
			this.selectAssessmentsList.show(
				new SelectAssessmentsListView({
					model: this.model,
					collection: this.collection,
					sortList: this.options.sortList,
					selectedAssessments: this.options.selectedAssessments,
					showNumbering: Registry.application.options.showNumbering,
					showGrouping: Registry.application.options.showGrouping,
					showDelete: false,

					// callbacks
					//
					onSelect: function() {
						self.configureButtons();
					}
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

			// add num scheduled runs badge
			//
			if (this.options.data['project']) {
				ScheduledRuns.fetchNumByProject(this.options.data['project'], {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#runs", number);
					}
				});
			} else if (this.options.data['projects'] && this.options.data['projects'].length > 0) {
				ScheduledRuns.fetchNumByProjects(this.options.data['projects'], {
					data: this.getFilterAttrs(['package', 'tool', 'platform']),

					success: function(number) {
						self.addBadge("#runs", number);
					}
				});
			} else {
				this.addBadge("#runs", 0);
			}
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

			// update badges
			//
			this.addBadges();
		},

		onClickResults: function() {
			var queryString = this.getQueryString();

			// go to assessment results view
			//
			Backbone.history.navigate('#results' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		},

		onClickRuns: function() {
			var queryString = this.getQueryString();

			// go to run requests view
			//
			Backbone.history.navigate('#run-requests' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		},

		onClickResetFilters: function() {
			this.assessmentFilters.currentView.reset();
		},

		onClickRunAssessments: function() {
			var self = this;
			var selectedAssessmentRuns = this.selectAssessmentsList.currentView.getSelected();
			
			if (selectedAssessmentRuns.length > 0) {

				// show confirm dialog box
				//
				Registry.application.modal.show(
					new ConfirmRunRequestView({
						selectedAssessmentRuns: selectedAssessmentRuns,

						// callbacks
						//
						accept: function(selectedAssessmentRuns, notifyWhenComplete) {
							self.scheduleOneTimeRunRequests(selectedAssessmentRuns, notifyWhenComplete);
						},

						reject: function() {

							// enable buttons
							//
							self.$el.find('#run-assessments').prop('disabled', false);
							self.$el.find('#schedule-assessments').prop('disabled', false);
							self.$el.find('#delete-assessments').prop('disabled', false);			
						}
					})
				);
			} else {

				// show no assessments selected notify view
				//
				Registry.application.modal.show(
					new NotifyView({
						message: "No assessments were selected.  To run an assessment, please select at least one item from the list of assessments."
					})
				);
			}	
		},

		onClickRunNewAssessment: function() {
			var project = this.options.data['project'] || this.model;

			if (project) {
				var queryString = this.getQueryString();

				// go to add new assessment view
				//
				Backbone.history.navigate('#assessments/run' + (queryString != ''? '?' + queryString : ''), {
					trigger: true
				});			
			} else {

				// show notify dialog
				//
				Registry.application.modal.show(
					new NotifyView({
						message: "To run a new assessment, you must first select a project."
					})
				);
			}
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		},

		onClickShowGrouping: function(event) {
			Registry.application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		},

		onClickScheduleAssessments: function() {
			if (this.options.data['project']) {
				var self = this;
				var selectedAssessments = this.selectAssessmentsList.currentView.getSelected();
				if (selectedAssessments.length > 0) {
					var queryString = this.getSelectedQueryString();

					// go to run requests schedule view
					//
					Backbone.history.navigate('/run-requests/add' + (queryString != ''? '?' + queryString : ''), {
						trigger: true
					});	
				} else {

					// show no assessments selected notify view
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "No assessments were selected.  To schedule an assessment, please select at least one item from the list of assessments."
						})
					);
				}
			} else {

				// show select project notify view
				//
				Registry.application.modal.show(
					new NotifyView({
						message: "No project was selected.  To schedule an assessment, please select a project (or no project) from the project filter."
					})
				);
			}
		},

		onClickDeleteAssessments: function() {
			var selectedAssessments = this.selectAssessmentsList.currentView.getSelected();
			var self = this;

			require([
				'views/assessments/delete/delete-assessments-view'
			], function (DeleteAssessmentsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'assessments', 

					// callbacks
					//
					done: function(view) {

						// show delete assessments view
						//
						view.content.show(
							new DeleteAssessmentsView({
								data: self.options.data,
								model: view.model,
								selectedAssessments: selectedAssessments
							})
						);
					}
				});
			});
		}
	});
});