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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
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
	'views/admin/status/run-queue-summary/run-queue-summary-view',
	'views/admin/status/run-queue/run-queue-view',
	'views/admin/status/run-status-list/run-status-list-view',
	'views/admin/status/viewer-status-list/viewer-status-list-view'
], function($, _, Backbone, Marionette, Tab, Template, Registry, Session, RunQueueSummaryView, RunQueueView, RunStatusListView, ViewerStatusListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		refreshInterval: 10000,

		regions: {
			runQueueSummary: '#run-queue-summary',
			runQueue: '#run-queue',
			runStatusList: '#run-status-list',
			viewerStatusList: '#viewer-status-list'
		},

		events: {
			'click #refresh': 'onClickRefresh',
			'click #auto-refresh': 'onClickAutoRefresh',
		},

		//
		// refresh methods
		//

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
				autoRefresh: Registry.application.options.autoRefresh
			}));
		},

		onRender: function() {	

			// show status list and schedule refresh
			//
			this.showRefreshingList();
		},

		fetchAndShowList: function(done) {
			var self = this;
			Session.fetchStatus({

				// callbacks
				//
				success: function(data) {

					// add returned HTML content to view
					//
					self.$el.find("#status").html(data);
					/*
					self.showRunQueueSummary(data["Condor Queue"]);
					self.showRunQueue(data["Condor Queue"]);
					self.showRunStatusList(data["Collector Assessment Records"]);
					self.showViewerStatusList(data["Collector Viewer Records"]);
					*/

					// perform callback
					//
					if (done) {
						done();
					}
				}
			});
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

		showRunQueue: function(data) {

			// preserve existing sorting order
			//
			if (this.runQueue.currentView) {
				this.runQueueSortList = this.runQueue.currentView.getSortList();
			}

			for (var key in data) {
				this.runQueue.show(
					new RunQueueView({
						server: key,
						collection: new Backbone.Collection(data[key]['data']),
						sortList: this.runQueueSortList
					})
				);			
			}
		},

		showRunStatusList: function(data) {

			// preserve existing sorting order
			//
			if (this.runStatusList.currentView) {
				this.runStatusSortList = this.runStatusList.currentView.getSortList();
			}

			for (var key in data) {
				this.runStatusList.show(
					new RunStatusListView({
						server: key,
						collection: new Backbone.Collection(data[key]['data']),
						sortList: this.runStatusSortList
					})
				);			
			}
		},

		showViewerStatusList: function(data) {

			// preserve existing sorting order
			//
			if (this.viewerStatusList.currentView) {
				this.viewerStatusSortList = this.viewerStatusList.currentView.getSortList();
			}

			for (var key in data) {
				this.viewerStatusList.show(
					new ViewerStatusListView({
						server: key,
						collection: new Backbone.Collection(data[key]['data']),
						sortList: this.viewerStatusSortList
					})
				);			
			}
		},

		//
		// event handling methods
		//

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
	});
});
