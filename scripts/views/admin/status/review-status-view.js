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
	'text!templates/admin/status/review-status.tpl',
	'registry',
	'models/users/session'
], function($, _, Backbone, Marionette, Template, Registry, Session) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		refreshInterval: 10000,

		events: {
			'click #refresh': 'onClickRefresh',
			'click #auto-refresh': 'onClickAutoRefresh',
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

					// perform callback
					//
					if (done) {
						done();
					}
				}
			});
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
