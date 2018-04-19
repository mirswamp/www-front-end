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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/tab',
	'text!templates/admin/status/review-status.tpl',
	'registry',
	'models/users/session',
	'models/assessments/execution-record',
	'collections/assessments/execution-records',
	'views/dialogs/error-view',
	'views/admin/status/run-queue-summary/run-queue-summary-view',
	'views/admin/status/status-tabs/status-tabs-view',
], function($, _, Backbone, Marionette, Tab, Template, Registry, Session, ExecutionRecord, ExecutionRecords, ErrorView, RunQueueSummaryView, StatusTabsView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		refreshInterval: 5000,

		regions: {
			runQueueSummary: '#run-queue-summary',
			details: '#details',
		},

		events: {
			'click #refresh': 'onClickRefresh',
			'click #auto-refresh': 'onClickAutoRefresh',
			'click a[role="tab"]': 'onClickTab',
			'click #show-numbering': 'onClickShowNumbering',
			'click #kill-runs': 'onClickKillRuns'
		},

		//
		// constructor
		//
		
		initialize: function(options) {
			this.tabState = [];
		},

		//
		// refresh methods
		//

		saveTabState: function() {
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
					if (this[tab] && this[tab].currentView) {
						this.tabState[tab].sortList = this[tab].currentView.getSortList();
					}
				}

				// save selected checkboxes
				//
				var detailsView = this.getRegion('details').currentView;
				if (detailsView['Condor Queue'] && detailsView['Condor Queue'].currentView) { 
					this.tabState['Condor Queue'].selected = detailsView['Condor Queue'].currentView.getSelected();
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
		// querying methods
		//

		getAutoRefresh: function() {
			return this.$el.find('#auto-refresh').is(':checked');
		},

		//
		// rendering methods
		//

		template: function(data) {		
			return _.template(Template, _.extend(data, {
				autoRefresh: Registry.application.options.autoRefresh,
				showNumbering: Registry.application.options.showNumbering
			}));
		},

		onRender: function() {		
			this.showRefreshingStatus();
		},

		isEmptyCondorQueue: function() {
			var queueTab = this.options.data["Condor Queue"];
			if (queueTab) {
				var queueKeys = Object.keys(queueTab);
				if (queueKeys) {
					var queueData = queueTab[queueKeys[0]];
					return !queueData || !queueData.data.length;
				}				
			}
		},

		update: function() {

			// show / hide kill-runs button
			//
			if ((!this.options.activeTab || this.options.activeTab == "Condor Queue")) {

				this.$el.find('#kill-runs').show();
			} else {
				this.$el.find('#kill-runs').hide();
			}

			if (this.isEmptyCondorQueue()) {
				this.$el.find('#kill-runs').attr('disabled', true);
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

			if (this.isEmptyCondorQueue()) {
				this.$el.find('#kill-runs').attr('disabled', true);
			}
		},

		showDetails: function(data) {
			this.details.show(
				new StatusTabsView({
					activeTab: this.options.activeTab,
					tabState: this.tabState,
					data: data,
					parent: this
				})
			);
		},

		showRunQueueSummary: function(data) {
			for (var key in data) {
				this.runQueueSummary.show(
					new RunQueueSummaryView({
						server: key,
						model: new Backbone.Model(data[key]['summary']),
					})
				);			
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
			Registry.application.setAutoRefresh(this.getAutoRefresh());

			// enable / disable refresh
			//
			if (Registry.application.options.autoRefresh) {
				this.enableAutoRefresh();
			} else {
				this.disableAutoRefresh();
			}
		},

		onClickTab: function(event) {
			this.options.activeTab = $(event.target).html();
			this.update();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.update();
		},

		onClickKillRuns: function(event) {
			var self = this;
			var selected = this.getRegion('details').currentView['Condor Queue'].currentView.getSelected()
			var collection = new ExecutionRecords();
			for (var i = 0; i < selected.length; i++) {
				var execrunuuid = selected.at(i).get('EXECRUNUID');
				var start = execrunuuid.indexOf('{') + 1;	
				var end = execrunuuid.indexOf('}', start) - 1;
				var type = selected.at(i).get('type');
				var uuid = execrunuuid.replace(/{.*}/, '');
				collection.add(new ExecutionRecord({
					execution_record_uuid: uuid,
					type: type	
				}));
			}
			collection.killAll({
				success: function() {
					self.fetchAndShow();
				},
				error: function() {
					Registry.application.modal.show(
				    	new ErrorView({
							message: "Could not kill all selected assessment runs."
						})  
					);
				}
			});
		}
	});
});
