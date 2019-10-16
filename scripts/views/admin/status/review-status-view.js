/******************************************************************************\
|                                                                              |
|                              review-status-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for displaying the current system status.       |
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
	'bootstrap/tab',
	'text!templates/admin/status/review-status.tpl',
	'models/users/session',
	'models/assessments/execution-record',
	'collections/assessments/execution-records',
	'views/base-view',
	'views/admin/status/run-queue-summary/run-queue-summary-view',
	'views/admin/status/status-tabs/status-tabs-view',
], function($, _, Tab, Template, Session, ExecutionRecord, ExecutionRecords, BaseView, RunQueueSummaryView, StatusTabsView) {
	return BaseView.extend({

		//
		// attributes
		//

		refreshInterval: 5000,

		template: _.template(Template),

		regions: {
			summary: '#run-queue-summary',
			details: '#details',
		},

		events: {
			'click #refresh': 'onClickRefresh',
			'click #auto-refresh': 'onClickAutoRefresh',
			'click a[role="tab"]': 'onClickTab',
			'click #show-numbering': 'onClickShowNumbering',
			'click #kill-runs': 'onClickKillRuns',
			// 'click #kill-viewers': 'onClickKillViewers',
			'click #shutdown-viewers': 'onClickShutdownViewers',
			'click .tab-pane input[name="select"]': 'onClickSelect',
			'click input.select-all': 'onClickSelect' 
		},

		//
		// constructor
		//
		
		initialize: function(options) {
			this.tabState = [];
			
			if (this.options.activeTab == undefined) {
				this.options.activeTab = "Condor Queue";
			}
		},

		//
		// refresh methods
		//

		saveTabState: function() {
			var detailsView;

			if (this.options.data) {

				// save sort order for each tab
				//
				var tabs = Object.keys(this.options.data);
				for (var i = 0; i < tabs.length; i++) {
					var tab = tabs[i];
					var id = tab.replace(/ /g, '_').toLowerCase() + '-panel';

					// create new state for each tab
					//
					this.tabState[tab] = {};

					// store sorting order for each tab
					//
					if (this.hasTabView(tab)) {
						this.tabState[tab].sortList = this.getTabView(tab).getSortList();
					}
				}

				// save selected checkboxes
				//
				if (this.hasActiveTabView() && this.getActiveTabView().getSelected) {
					this.tabState[this.options.activeTab].selected = this.getActiveTabView().getSelected();
				}
			}
		},

		enableAutoRefresh: function() {
			this.$el.find('button#refresh').hide();
			this.scheduleNextRefresh();
		},

		disableAutoRefresh: function() {
			this.$el.find('button#refresh').show();
			window.clearTimeout(this.timeout);
		},

		scheduleNextRefresh: function() {
			var self = this;
			
			this.timeout = window.setTimeout(function() {
				self.showRefreshingStatus();
			}, this.refreshInterval);
		},

		showRefreshingStatus: function() {
			var self = this;

			// save tab state
			//
			this.saveTabState();

			// fetch status data and render
			//
			this.fetchAndShow(function() {

				// set up refresh
				//
				if (self.getAutoRefresh()) {
					self.scheduleNextRefresh();
				}
			});
		},

		//
		// job killing methods
		//

		killRuns: function(runs, options) {
			var self = this;
			var collection = new ExecutionRecords();
			for (var i = 0; i < runs.length; i++) {
				var execrunuuid = runs.at(i).get('EXECRUNUID');
				var start = execrunuuid.indexOf('{') + 1;	
				var end = execrunuuid.indexOf('}', start) - 1;
				var type = runs.at(i).get('type');
				var uuid = execrunuuid.replace(/{.*}/, '');
				collection.add(new ExecutionRecord({
					execution_record_uuid: uuid,
					type: type	
				}));
			}
			collection.killAll(_.extend({
				async: true,
				
				// callbacks
				//
				success: function() {
					self.fetchAndShow();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not kill all selected assessment runs."
					});
				}
			}, options));
		},

		//
		// querying methods
		//

		getAutoRefresh: function() {
			return this.$el.find('#auto-refresh').is(':checked');
		},

		hasTabView: function(tab) {
			return this.hasChildView('details') && this.getChildView('details').hasChildView(tab);
		},

		getTabView: function(tab) {
			if (this.hasChildView('details')) {
				return this.getChildView('details').getChildView(tab);
			}
		},

		hasActiveTabView: function() {
			return this.hasTabView(this.options.activeTab);
		},

		getActiveTabView: function() {
			return this.getTabView(this.options.activeTab);
		},

		//
		// rendering methods
		//

		templateContext: function() {		
			return {
				autoRefresh: application.options.autoRefresh,
				showNumbering: application.options.showNumbering
			};
		},

		onRender: function() {		
			this.showRefreshingStatus();
		},

		isEmptyQueue: function(queueName) {
			var queueTab = this.options.data[queueName];
			if (queueTab) {
				var queueKeys = Object.keys(queueTab);
				if (queueKeys) {
					var queueData = queueTab[queueKeys[0]];
					return !queueData || !queueData.data.length;
				}				
			}
		},

		fetchAndShow: function(done) {
			var self = this;

			// fetch new status info
			//
			Session.fetchStatus({

				// callbacks
				//
				success: function(data) {

					// show status info
					//
					self.showStatus(data);

					// perform callback
					//
					if (done) {
						done();
					}
				}
			});
		},

		showStatus: function(data) {
			this.options.data = data;

			// update child views
			//
			this.showRunQueueSummary(data["Condor Queue"]);
			this.showDetails(data);	
		},

		showDetails: function(data) {
			this.showChildView('details', new StatusTabsView({
				activeTab: this.options.activeTab,
				tabState: this.tabState,
				data: data,
				parent: this
			}));
		},

		showRunQueueSummary: function(data) {
			for (var key in data) {
				this.showChildView('summary', new RunQueueSummaryView({
					server: key,
					model: new Backbone.Model(data[key].summary)
				}));			
			}
		},

		//
		// event handling methods
		//

		onClickRefresh: function() {
			
			// save tab state
			//
			this.saveTabState();

			// fetch status data and render
			//
			this.fetchAndShow();
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

		onClickTab: function() {

			// show / hide kill-runs button
			//
			if ((this.options.activeTab == "Assessment Queue") || (this.options.activeTab == "Metric Queue")) {
				this.$el.find('#kill-runs').show();
			} else {
				this.$el.find('#kill-runs').hide();
			}

			// show / hide viewer buttons
			//
			if (this.options.activeTab == "Viewer Queue") {
				// this.$el.find('#kill-viewers').show();
				this.$el.find('#shutdown-viewers').show();
			} else {
				// this.$el.find('#kill-viewers').hide();
				this.$el.find('#shutdown-viewers').hide();
			}

			// enable / disable buttons
			//
			if (this.hasActiveTabView()) {
				var selected = (this.getActiveTabView().$el.find('input[name="select"]:checked').length > 0);
				this.$el.find('#kill-runs').attr('disabled', !selected);
				this.$el.find('#shutdown-viewers').attr('disabled', !selected);
			}
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showDetails(this.options.data);
		},

		onClickKillRuns: function(event) {
			var selected = this.getActiveTabView().getSelected();
			this.killRuns(selected, {
				hard: true
			});
		},

		onClickKillViewers: function(event) {
			var selected = this.getChildView('details').getChildView('Viewer Queue').getSelected();
			this.killRuns(selected, {
				hard: true
			});
		},

		onClickShutdownViewers: function(event) {
			var selected = this.getChildView('details').getChildView('Viewer Queue').getSelected();
			this.killRuns(selected, {
				hard: false
			});
		},

		onClickSelect: function() {
			var tabView = this.getActiveTabView();
			if (tabView.$el.find('input[name="select"]:checked').length > 0) {
				this.$el.find('#kill-runs').removeAttr('disabled');
				this.$el.find('#shutdown-viewers').removeAttr('disabled');
			} else {
				this.$el.find('#kill-runs').attr('disabled', true);
				this.$el.find('#shutdown-viewers').attr('disabled', true);
			}
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			if (this.timeout) {
				window.clearTimeout(this.timeout);
				this.timeout = null;
			}
		}
	});
});
