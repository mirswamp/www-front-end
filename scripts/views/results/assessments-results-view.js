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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/results/assessments-results.tpl',
	'models/projects/project',
	'models/run-requests/run-request',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/base-view',
	'views/results/assessment-runs/filters/assessment-runs-filters-view',
	'views/results/assessment-runs/select-list/select-assessment-runs-list-view',
	'views/results/native-viewer/native-viewer-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Template, Project, RunRequest, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, BaseView, AssessmentRunsFiltersView, SelectAssessmentRunsListView, NativeViewerView, VersionFilterSelectorView) {
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
					return project.get('full_name') + ' Assessment Results';
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
					this.showInfo("No results have been selected - viewing results will display previously viewed results.");
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
			var useJavascript = useNativeViewer && executionRecords && executionRecords.length > 1;
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

		showEnabledViewers: function() {

			/*
			var executionRecords = this.getSelected();
			for (var i = 0; i < executionRecords.length; i++) {
				var tool = executionRecords.at(i).get('tool');

				// check for Sonatype tool
				//
				if (tool.name == 'Sonatype Application Health Check') {

					// hide viewer selection
					//
					this.$el.find('#viewers-accordion').hide();

					// select native viewer
					//
					this.$el.find('input[name="viewers"]').removeAttr('checked');
					this.$el.find('input#Native')[0].checked = true;
					this.$el.find('input#Native').trigger('click');
					return;
				}
			}
			*/

			// show viewer selection
			//
			this.$el.find('#viewers-accordion').show();
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
			if (this.getChildView('list')) {
				return this.getChildView('list').getSelected();
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
			var useNativeViewer = (viewer && viewer.get('name').toLowerCase().indexOf('native') != -1);
			var projectUuid = this.getAssesmentRunProjectUuid();
			var url = application.getURL() + '#results/' + assessmentResultUuids + '/viewer/' + (viewer? viewer.get('viewer_uuid') : '') + '/project/' + projectUuid;

			if (useNativeViewer) {
				return url + '?to=' + NativeViewerView.itemsPerPage;
			} else {
				return url;
			}
		},

		getAutoRefresh: function() {
			return this.$el.find('#auto-refresh').is(':checked');
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
			new ExecutionRecords().fetchByProject(project, {

				// attributes
				//
				data: this.getFilterAttrs(['package', 'tool', 'platform', 'date', 'limit']),

				// callbacks
				//
				success: function(collection) {
					done(collection);
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
			new ExecutionRecords().fetchByProjects(projects, {

				// attributes
				//
				data: this.getFilterAttrs(['package', 'tool', 'platform', 'date', 'limit']),

				// callbacks
				//
				success: function(collection) {
					done(collection);
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
					done(new ExecutionRecords());
				}
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.getTitle(),
				shortTitle: this.getShortTitle(),
				showNavigation: Object.keys(this.options.data).length > 0,
				viewers: this.options.viewers,
				showNumbering: application.options.showNumbering,
				showGrouping: application.options.showGrouping,
				autoRefresh: application.options.autoRefresh
			};
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

		onAttach: function() {

			// set initial state of view results notice and button
			//
			this.setViewResultsLink();
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
			this.fetchExecutionRecords(function(collection) {

				// show list if changed
				//
				if (!self.listShown || !self.collection.equalTo(collection)) {
					self.collection = collection;
					self.showList();
					self.listShown = true;
				}

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
			if (this.getChildView('list') && this.collection.length > 0) {
				this.options.sortList = this.getChildView('list').getSortList();
			}

			// show assessment runs list view
			//
			this.showChildView('list', new SelectAssessmentRunsListView({
				model: this.model,
				collection: this.collection,
				viewer: this.getSelectedViewer(),
				viewers: this.options.viewers,
				selectedExecutionRecords: this.options.selectedExecutionRecords,
				errorViewer: this.options.viewers.getNative(),
				selected: selected,
				sortList: this.options.sortList,
				queryString: this.getQueryString(),
				showProjects: application.session.user.get('has_projects'),
				showNumbering: application.options.showNumbering,
				showGrouping: application.options.showGrouping,
				showStatus: true,
				showErrors: true,
				showDelete: false,
				showSsh: true,
				parent: this,

				// callback
				//
				onSelect: function() {
					self.setViewResultsLink();
					self.showEnabledViewers();
				}
			}));
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
					var url = application.getURL() + '#results/' + assessmentResultUuids + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + projectUuid;
					var target = '_blank';
					var replace = false;

					// open new popup window
					//
					var resultsWindow = window.open(url, target, options, replace);
				} else {

					// show notification
					//
					application.notify({
						message: "Can't open CodeDx because no project has been selected."
					});
				}
			} else {

				// show notification
				//
				application.notify({
					message: "Package names and versions must match to view multiple assessment results with CodeDX."
				});
			}
		},

		showCodeDxViewer: function(viewer) {
			var self = this;
			if (this.getSelected().length == 0) {

				// show confirmation
				//
				application.confirm({
					message: "No assessment results have been selected. This will launch CodeDx using previously viewed assessment results.  Are you sure you want to continue?",
				
					// callbacks
					//
					accept: function(){
						self.launchCodeDxViewer(viewer);
					}
				});
			} else {
				this.launchCodeDxViewer(viewer);
			}
		},

		showNativeViewer: function(viewer) {
			var self = this;

			if (this.getSelected().length == 0) {

				// show notification
				//
				application.notify({
					message: "You must first select at least one assessment result to show."
				});
			} else {

				// display each selected assessment result
				//
				var executionRecords = this.getSelected().toArray();
				for (var i = 0; i < executionRecords.length; i++) {
					var executionRecord = executionRecords[i];
					var options = 'scrollbars=yes,directories=yes,titlebar=yes,toolbar=yes,location=yes';
					var queryString = '?to=' + NativeViewerView.itemsPerPage;
					var url = application.getURL() + '#results/' + executionRecord.get('assessment_result_uuid') + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + executionRecord.get('project_uuid') + queryString;
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
			});
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

			// update view result button / link
			//
			this.setViewResultsLink();

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
			this.getChildView('filters').reset();
		},

		onClickRefresh: function() {
			this.fetchAndShowList();
		},

		onClickAutoRefresh: function(event) {

			// store refresh in cookie
			//
			application.setAutoRefresh(this.getAutoRefresh());

			// enable / disable refresh
			//
			if (application.options.autoRefresh) {
				this.enableAutoRefresh();
			} else {
				this.disableAutoRefresh();
			}
		},

		onClickAlertClose: function() {
			this.hideInfo();
		},

		onClickViewersRadioButton: function() {

			// update view results button
			//
			this.setViewResultsLink();
			this.showList();
		},

		onClickShowNumbering: function() {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		},

		onClickShowGrouping: function() {
			application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		},

		onClickDeleteResults: function() {
			var selectedExecutionRecords = this.getSelected();
			var self = this;

			require([
				'utilities/web/query-strings',
				'utilities/web/url-strings',
				'views/results/delete/delete-assessments-results-view'
			], function (QueryStrings, UrlStrings, DeleteAssessmentsResultsView) {

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
						view.showChildView('content', new DeleteAssessmentsResultsView({
							data: self.options.data,
							model: view.model,
							viewers: self.options.viewers,
							selectedExecutionRecords: selectedExecutionRecords
						}));
					}
				});
			});
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			if (this.timeout) {
				window.clearTimeout(this.timeout);
			}		
		}
	});
});
