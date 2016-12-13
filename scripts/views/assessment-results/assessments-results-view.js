/******************************************************************************\
|                                                                              |
|                            assessments-results-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a project's current list of.        |
|        assessment runs and results.                                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/assessment-results/assessments-results.tpl',
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
			'click #assessments': 'onClickAssessments',
			'click #runs': 'onClickRuns',
			'click #reset-filters': 'onClickResetFilters',
			'click #refresh': 'onClickRefresh',
			'click #auto-refresh': 'onClickAutoRefresh',
			'click .alert .close': 'onClickAlertClose',
			'click input[name="viewers"]': 'onClickViewersRadioButton',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping',
			'click #delete-results': 'onClickDeleteResults'
		},

		threadFixMessage: "SWAMP will run a private ThreadFix viewer, protected by SWAMP system security, for your project. The ThreadFix viewer has its own internal account that is independent from your SWAMP account. For this reason, please do not use the password change or logout functions in SWAMP's private ThreadFix viewer, because they are redundant when using ThreadFix in the SWAMP environment.",

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

		//
		// methods
		//

		enableAutoRefresh: function() {
			this.$el.find('button#refresh').hide();
			this.scheduleNextRefresh();
		},

		disableAutoRefresh: function() {
			this.$el.find('button#refresh').show();
			window.clearTimeout(this.timeout);
		},

		setViewNoResults: function() {

			// remove event handlers
			//
			this.$el.find('#view-results').off('click');

			// remove link
			//
			this.$el.find('#view-results').removeAttr('href');

			// disable view results button
			//
			this.$el.find('#view-results').addClass('disabled');

			// show info message
			//
			this.showInfo("At least one result must be selected to view results.");
		},

		setViewMultipleNativeResults: function() {

			// remove event handlers
			//
			this.$el.find('#view-results').off('click');
			
			// remove link
			//
			this.$el.find('#view-results').removeAttr('href');

			// enable view results button
			//
			this.$el.find('#view-results').removeClass('disabled');	

			// set event handler
			//
			var self = this;
			this.$el.find('#view-results').on('click', function() {
				self.showSelectedViewer();
			});

			// show info message
			//
			this.showInfo("Click the view assessment results button to view the selected results.  Note that multiple windows will be opened.  Your web browser's popup blocker may need to be disabled to view results.");		
		},

		setViewNonNativeResults: function(executionRecords) {

			// remove event handlers
			//
			this.$el.find('#view-results').off('click');

			// set link on view results button
			//
			this.$el.find('#view-results').attr('href', this.getResultsUrl());

			// check consistent packages checked
			//
			if (!this.consistentPackagesSelected()) {

				// disable view results button
				//
				this.$el.find('#view-results').addClass('disabled');

				// show info message
				//
				this.showInfo("Package names and versions must match to view multiple assessment results.");
			} else {

				// enable view results button
				//
				this.$el.find('#view-results').removeClass('disabled');	

				// show info message
				//
				if (!executionRecords || executionRecords.length == 0) {
					this.showInfo("No results have been selected - viewing results will display previously viewed results.")
				} else {
					this.showInfo("Click the view assessment results button to view the selected results using the selected viewer.");
				}
			}
		},

		setViewResultsLink: function() {
			var self = this;
			var viewer = this.getSelectedViewer();
			var executionRecords = this.getSelected();
			var useNativeViewer = (viewer && viewer.get('name').toLowerCase().indexOf('native') != -1);
			var useJavascript = useNativeViewer && executionRecords.length > 1;
			var noResults = !executionRecords || executionRecords.length == 0;

			// set results link
			//
			if (useNativeViewer && noResults) {
				this.setViewNoResults();
			} else if (useJavascript) {
				this.setViewMultipleNativeResults();
			} else {
				this.setViewNonNativeResults(executionRecords);
			}

			// add check for viewer permission
			//
			if (viewer) {
				this.checkViewerPermission(viewer, {
					error: function(response) {

						// disable view results button
						//
						self.$el.find('#view-results').addClass('disabled');

						// show info message
						//
						self.showInfo("You do not have permission to view the selected results.");

						// allow user to sign the EULA
						//
						var runRequest = new RunRequest({});
						runRequest.handleError(response);
					}
				});
			}
		},

		//
		// checking methods
		//

		checkViewerPermission: function(viewer, options) {
			var executionRecords = this.getSelected();
			var assessmentResultUuids = executionRecords && executionRecords.length > 0? executionRecords.getAttributes('assessment_result_uuid').join(',') : '';

			// check viewer permissions
			//
			viewer.checkPermission(assessmentResultUuids, this.model.get('project_uid'), options);
		},

		//
		// querying methods
		//

		getSelected: function() {
			if (this.assessmentRunsList.currentView) {
				return this.assessmentRunsList.currentView.getSelected();
			}
		},

		getAssesmentRunProjectUuid: function() {
			var executionRecords = this.getSelected();

			// check if some assessment runs are selected
			//
			if (executionRecords && executionRecords.length > 0) {

				// use project from first checked run
				//
				return executionRecords.toArray()[0].get('project_uuid');

			// check if a project filter is selected
			//
			} else if (this.options.data['project']) {
				return this.options.data['project'].get('project_uid');

			// use default project
			//
			} else if (this.model) {
				return this.model.get('project_uid');
			} else {
				return '';
			}
		},

		consistentPackagesSelected: function() {
			var selected = this.getSelected();

			if (selected) {
				var firstItem;
				var executionRecords = this.getSelected().toArray();
				for (var i = 0; i < executionRecords.length; i++) {
					var item = executionRecords[i];
					if (!firstItem) {
						firstItem = item;
					} else {
						var firstPackage = firstItem.get('package');
						var nextPackage = item.get('package');
						if (firstPackage.name != nextPackage.name || 
							firstPackage.version_string != nextPackage.version_string) {
							return false;
						}				
					}
				}		
			}

			return true;
		},

		getSelectedViewer: function() {
			var index = $("input[name='viewers']:checked").attr('index');
			return this.options.viewers.at(index);
		},

		getResultsUrl: function() {
			var executionRecords = this.getSelected();
			var assessmentResultUuids = executionRecords && executionRecords.length > 0? executionRecords.getAttributes('assessment_result_uuid').join(',') : 'none';
			var viewer = this.getSelectedViewer();
			var projectUuid = this.getAssesmentRunProjectUuid();
			return Registry.application.getURL() + '#results/' + assessmentResultUuids + '/viewer/' + (viewer? viewer.get('viewer_uuid') : '') + '/project/' + projectUuid;
		},

		getAutoRefresh: function() {
			return this.$el.find('#auto-refresh').is(':checked');
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
			this.showRefreshingList();

			// add count bubbles / badges
			//
			this.addBadges();
		},

		onShow: function() {

			// set initial state of view results notice and button
			//
			this.setViewResultsLink();
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

		scheduleNextRefresh: function() {
			var self = this;
			
			this.timeout = window.setTimeout(function() {
				self.showRefreshingList();
			}, this.refreshInterval);
		},

		showRefreshingList: function() {
			var self = this;

			// show assessment runs list
			//
			this.fetchAndShowList(function() {

				// set up refresh
				//
				if (self.getAutoRefresh()) {
					self.scheduleNextRefresh();
				}
			});
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
					viewer: this.getSelectedViewer(),
					viewers: this.options.viewers,
					selectedExecutionRecords: this.options.selectedExecutionRecords,
					errorViewer: this.options.viewers.getNative(),
					selected: selected,
					sortList: this.options.sortList,
					queryString: this.getQueryString(),
					showNumbering: Registry.application.options.showNumbering,
					showGrouping: Registry.application.options.showGrouping,
					showStatus: true,
					showErrors: true,
					showDelete: false,
					showSsh: true,
					parent: this,

					// callback
					//
					onSelect: function() {
						self.setViewResultsLink();
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
		// viewer launching methods
		//

		launchCodeDxViewer: function(viewer) {

			// check to ensure package names and versions all match
			//
			if (this.consistentPackagesSelected()) {
				var projectUuid = this.getAssesmentRunProjectUuid();
				if (projectUuid) {
					var executionRecords = this.getSelected();
					var assessmentResultUuids = executionRecords.length > 0? executionRecords.getAttributes('assessment_result_uuid').join(',') : 'none';

					// open results window
					//
					var options = 'scrollbars=yes,directories=yes,titlebar=yes,toolbar=yes,location=yes';
					var url = Registry.application.getURL() + '#results/' + assessmentResultUuids + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + projectUuid;
					var target = '_blank';
					var replace = false;

					// open new popup window
					//
					var resultsWindow = window.open(url, target, options, replace);
				} else {

					// show error dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "Can't open CodeDx because no project has been selected."
						})
					);				
				}
			} else {

				// show error dialog
				//
				Registry.application.modal.show(
					new NotifyView({
						message: "Package names and versions must match to view multiple assessment results with CodeDX."
					})
				);	
			}
		},

		showCodeDxViewer: function(viewer) {
			var self = this;
			if (this.getSelected().length == 0) {

				// show confirm dialog
				//
				Registry.application.modal.show(
					new ConfirmView({
						message: "No assessment results have been selected. This will launch CodeDx using previously viewed assessment results.  Are you sure you want to continue?",
					
						// callbacks
						//
						accept: function(){
							self.launchCodeDxViewer(viewer);
						}
					})
				);			
			} else {
				this.launchCodeDxViewer(viewer);
			}
		},

		showNativeViewer: function(viewer) {
			var self = this;

			if (this.getSelected().length == 0) {

				// show error dialog
				//
				Registry.application.modal.show(
					new NotifyView({
						message: "You must first select at least one assessment result to show."
					})
				);			
			} else {

				// display each selected assessment result
				//
				var executionRecords = this.getSelected().toArray();
				for (var i = 0; i < executionRecords.length; i++) {
					var executionRecord = executionRecords[i];
					var options = 'scrollbars=yes,directories=yes,titlebar=yes,toolbar=yes,location=yes';
					var url = Registry.application.getURL() + '#results/' + executionRecord.get('assessment_result_uuid') + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + executionRecord.get('project_uuid');
					var target = '_blank';
					var replace = false;

					// open new popup window
					//
					var resultsWindow = window.open(url, target, options, replace);
				}
			}
		},

		showViewer: function(viewer) {
			var self = this;

			this.checkViewerPermission(viewer, {
				success: function() {
					if (viewer.isNative()) {
						self.showNativeViewer(viewer);
					} else {
						self.showCodeDxViewer(viewer);
					}
				},

				error: function(response) {
					var runRequest = new RunRequest({});
					runRequest.handleError(response);
				}
			})
		},

		showSelectedViewer: function() {
			this.showViewer(this.getSelectedViewer());
		},

		showInfo: function(message) {
			this.$el.find('.alert-info .message').html(message);
			this.$el.find('.alert-info').show();
		},

		hideInfo: function() {
			this.$el.find('.alert-info').hide();
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

		onClickAssessments: function() {
			var queryString = this.getQueryString();

			// go to assessments view
			//
			Backbone.history.navigate('#assessments' + (queryString != ''? '?' + queryString : ''), {
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
			this.assessmentRunsFilters.currentView.reset();
		},

		onClickRefresh: function() {
			this.fetchAndShowList();
		},

		onClickAutoRefresh: function(event) {

			// store refresh in cookie
			//
			Registry.application.setAutoRefresh(this.getAutoRefresh());

			// enable / disable refresh
			//
			if (Registry.application.options.autoRefresh) {
				this.enableAutoRefresh();
			} else {
				this.disableAutoRefresh();
			}
		},

		onClickAlertClose: function() {
			this.hideInfo();
		},

		onClickViewersRadioButton: function() {

			// check for ThreadFix
			//
			var viewer = this.getSelectedViewer();
			if (viewer.get('name') == 'ThreadFix') {
				Registry.application.modal.show(
					new NotifyView({
						message: this.threadFixMessage
					})
				);
			}

			// update view results button
			//
			this.setViewResultsLink();
			this.showList();
		},

		onClickShowNumbering: function() {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		},

		onClickShowGrouping: function() {
			Registry.application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		},

		onClickDeleteResults: function() {
			var selectedExecutionRecords = this.getSelected();
			var self = this;

			require([
				'registry',
				'utilities/browser/query-strings',
				'utilities/browser/url-strings',
				'views/dialogs/error-view',
				'views/assessment-results/delete/delete-assessments-results-view'
			], function (Registry, QueryStrings, UrlStrings, ErrorView, DeleteAssessmentsResultsView) {

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
							new DeleteAssessmentsResultsView({
								data: self.options.data,
								model: view.model,
								viewers: self.options.viewers,
								selectedExecutionRecords: selectedExecutionRecords
							})
						);
					}
				});
			});
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			/*
			if (this.interval) {
				window.clearInterval(this.interval);
			}
			*/

			if (this.timeout) {
				window.clearTimeout(this.timeout);
			}		
		}
	});
});
