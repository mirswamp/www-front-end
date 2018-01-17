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
	'views/admin/status/uuid-item-list/uuid-item-list-view',
	'views/admin/status/uuid-item-select-list/uuid-item-select-list-view'
], function($, _, Backbone, Marionette, Tab, Template, Registry, Session, ExecutionRecord, ExecutionRecords, ErrorView, RunQueueSummaryView, UuidItemListView, UuidItemSelectListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		refreshInterval: 10000,

		regions: {
			runQueueSummary: '#run-queue-summary',
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
			var tabs = Object.keys(this.options.data);
			for (var i = 0; i < tabs.length; i++) { 
				var tab = tabs[i];
				var id = tab.replace(/ /g, '_').toLowerCase() + '-panel';
				if (this[tab] && this[tab].currentView) {
					this.tabState[tab] = { 
						sortList: this[tab].currentView.getSortList() 
					};
				}
			}	
			if (this['Condor Queue'] && this['Condor Queue'].currentView) { 
				this.tabState['Condor Queue'].selected = this['Condor Queue'].currentView.getSelected();
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
				self.showRefreshingList();
			}, this.refreshInterval);
		},

		showRefreshingList: function() {
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

			// check if active tab is not found in list of tabs
			//
			if (this.options.activeTab) {	
				if (!this.options.data[this.options.activeTab]) {
					this.options.activeTab = undefined;
				}
			}
		 		
			return _.template(Template, _.extend(data, {
				tabs: Object.keys(this.options.data),
				activeTab: this.options.activeTab,
				autoRefresh: Registry.application.options.autoRefresh,
				showNumbering: Registry.application.options.showNumbering
			}));
		},

		onRender: function() {	
			this.showRunQueueSummary(this.options.data["Condor Queue"]);
			this.showTabs(this.options.data);
			
			// show status list and schedule refresh
			//
			if (!this.isRendered) {
				this.showRefreshingList();
			}

			this.update();
			this.isRendered = true;
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

			// show/hide kill-runs button
			//
			if ((!this.options.activeTab || this.options.activeTab == "Condor Queue") && !this.isEmptyCondorQueue()) {

				this.$el.find('#kill-runs').show();
			} else {
				this.$el.find('#kill-runs').hide();
			}
		},

		fetchAndShow: function(done) {
			var self = this;
			Session.fetchStatus({

				// callbacks
				//
				success: function(data) {
					self.options.data = data;

					// update entire display 
					//
					self.render();	

					// perform callback
					//
					if (done) {
						done();
					}
				}
			});
		},

		showTabs: function(data) {
			if (!data) {
				return;
			}

			var tabs = Object.keys(data);
			for (var i = 0; i < tabs.length; i++) { 
				var tab = tabs[i];
				var id = tab.replace(/ /g, '_').toLowerCase() + '-panel';
				var region = this.addRegion(tab, '#' + id);	
				var object = data[tab];	
				if (object) {
					var keys = Object.keys(object); 
					if (keys.length > 0) {	
						var item = object[keys[0]]; 
						if (tab == "Condor Queue") {
							region.show(new UuidItemSelectListView({
								fieldnames: item.fieldnames,
								collection: new Backbone.Collection(item.data),
								showNumbering: Registry.application.options.showNumbering,
								sortList: this.tabState[tab] ? this.tabState[tab].sortList : undefined,
								selected: this.tabState[tab] ? this.tabState[tab].selected : undefined
							}));
						} else {
							region.show(new UuidItemListView({
								fieldnames: item.fieldnames,
								collection: new Backbone.Collection(item.data),
								showNumbering: Registry.application.options.showNumbering,
								sortList: this.tabState[tab] ? this.tabState[tab].sortList : undefined
							}));
						}
					}
				}				
			}
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
			this.options.activeTab = $(event.target).closest('li').find('span').html();
			this.update();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.render();
		},

		onClickKillRuns: function(event) {
			var self = this;
			var selected = this["Condor Queue"].currentView.getSelected();
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
