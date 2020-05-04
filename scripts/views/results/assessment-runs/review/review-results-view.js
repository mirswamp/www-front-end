/******************************************************************************\
|                                                                              |
|                              review-results-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing all runs and results.               |
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
	'text!templates/results/assessment-runs/review/review-results.tpl',
	'models/projects/project',
	'models/run-requests/run-request',
	'collections/assessments/execution-records',
	'views/base-view',
	'views/results/assessment-runs/filters/review-results-filters-view',
	'views/results/assessment-runs/list/assessment-runs-list-view'
], function($, _, Template, Project, RunRequest, ExecutionRecords, BaseView, ReviewResultsFiltersView, AssessmentRunsListView) {
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
			'click #view-assessments': 'onClickViewAssessments',
			'click #view-runs': 'onClickViewRuns',
			'click #reset-filters': 'onClickResetFilters',
			'click #refresh': 'onClickRefresh',
			'click #auto-refresh': 'onClickAutoRefresh',
			'click button.view': 'onClickViewer',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping',
			'click #cancel': 'onClickCancel',
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new ExecutionRecords();
			this.checked = {};
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

		//
		// ajax methods
		//

		fetchExecutionRecords: function(done) {
			this.request = this.collection.fetchAll({

				// attributes
				//
				data: this.getChildView('filters')? this.getChildView('filters').getAttrs() : null,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get execution records."
					});
				}
			});
		},

		//
		// querying methods
		//

		getAutoRefresh: function() {
			return this.$el.find('#auto-refresh').is(':checked');
		},

		getQueryString: function() {
			return this.getChildView('filters').getQueryString();
		},

		getFilterData: function() {
			return this.getChildView('filters').getData();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				project: this.options.data.project,
				package: this.options.data.package,
				packageVersion: this.options.data['package-version'],
				tool: this.options.data.tool,
				toolVersion: this.options.data['tool-version'],
				platform: this.options.data.platform,
				platformVersion: this.options.data['platform-version'],
				showNavigation: Object.keys(this.options.data).length > 0,
				showGrouping: application.options.showGrouping,
				autoRefresh: application.options.autoRefresh,
				viewers: this.options.viewers
			};
		},

		onRender: function() {

			// show assessment result filters
			//
			this.showFilters();

			// show assessments runs list and schedule refresh
			//
			this.showRefreshingList();
		},

		showFilters: function() {
			var self = this;
			
			// show assessment results filters
			//
			this.showChildView('filters', new ReviewResultsFiltersView({
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

		showList: function() {

			// preserve existing sorting column and order
			//
			if (this.getChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}
			
			// show assessment runs list
			//
			this.showChildView('list', new AssessmentRunsListView({
				model: this.model,
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				viewers: this.options.viewers,
				checked: this.checked,
				queryString: this.getQueryString(),
				showGrouping: application.options.showGrouping,
				showStatus: true,
				showErrors: false,
				showDelete: false,
				showSsh: false
			}));
		},
		
		fetchAndShowList: function(done) {
			var self = this;
			this.fetchExecutionRecords(function() {

				// show assessment runs list
				//
				self.showList();

				// perform callback
				//
				if (done) {
					done();
				}
			});
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

		//
		// viewer launching methods
		//

		consistentPackagesChecked: function() {
			var firstItem;

			for (var key in this.checked) {
				var item = this.checked[key];
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

			return true;
		},

		showCodeDxViewer: function(viewer) {
			var self = this;

			// check to ensure package names and versions all match
			//
			if (this.consistentPackagesChecked()) {

				// open results window
				//
				var options = 'scrollbars=yes,directories=yes,titlebar=yes,toolbar=yes,location=yes';
				var results = Object.keys( this.checked ).length > 0 ? encodeURIComponent( Object.keys( this.checked ).join(',') ) : 'none';
				var url = application.getURL() + '#results/' + results + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + self.model.get('project_uid');
				var target = '_blank';
				var replace = false;

				// open new popup window
				//
				var resultsWindow = window.open(url, target, options, replace);
			} else {

				// show notification
				//
				application.notify({
					message: "Package names and versions must match to view multiple assessment results with CodeDX."
				});
			}
		},

		showNativeViewer: function(viewer) {
			var self = this;

			_.each( Object.keys( this.checked ),  function( assessment_result_uuid ){	
				var options = 'scrollbars=yes,directories=yes,titlebar=yes,toolbar=yes,location=yes';
				var url = application.getURL() + '#results/' + assessment_result_uuid + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + self.model.get('project_uid');
				var target = '_blank';
				var replace = false;

				// open new popup window
				//
				var resultsWindow = window.open(url, target, options, replace);
			});
		},

		showViewer: function(viewer) {
			var self = this;

			// check viewer permissions
			//
			viewer.checkPermission(Object.keys(self.checked).join(','), this.model.get('project_uid'), {
				
				// callbacks
				//
				success: function(){
					if (viewer.get('name').toLowerCase().indexOf('dx') != -1) {
						self.showCodeDxViewer(viewer);
					} else {
						self.showNativeViewer(viewer);
					}
				},
				
				error: function(response){
					var runRequest = new RunRequest({});
					runRequest.handleError(response);
				}
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

		onClickViewAssessments: function() {

			// go to assessments view
			//
			application.navigate('#assessments');
		},

		onClickViewRuns: function() {

			// go to run requests view
			//
			application.navigate('#run-requests');
		},

		onClickResetFilters: function() {
			this.getChildView('filters').reset();
		},

		onClickViewer: function(event) {
			var index = parseInt($(event.target).attr("index"));
			var viewer = this.options.viewers.at(index);
			this.showViewer(viewer);
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

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		},

		onClickShowGrouping: function() {
			application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		},
		
		onClickCancel: function() {

			// return to overview
			//
			application.navigate('#overview');
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			if (this.timeout) {
				window.clearTimeout(this.timeout);
			}

			// clear pending requests
			//
			if (this.request && this.request.state() == 'pending') {
				this.request.abort();
			}
		}
	});
});
