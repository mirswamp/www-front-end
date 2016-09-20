/******************************************************************************\
|                                                                              |
|                                user-profile-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a read-only view of the user's profile information.      |
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
  'text!templates/users/user-profile/user-profile.tpl',
  'config',
  'registry',
   'utilities/time-utils'
], function($, _, Backbone, Marionette, Template, Config, Registry, TimeUtils) {
	return Backbone.Marionette.ItemView.extend({

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				config: Registry.application.config,
				myProfile: this.model.isCurrentUser(),
				showUserType: Registry.application.session.user.isAdmin()
			}));
		},

		updateTime: function() {
			var now = new Date();

			// update time since last login
			//
			if (this.model.has('penultimate_login_date')) {
				this.$el.find('#time-since-previous-login').html(elapsedTimeToHTML(UTCDateToLocalDate(this.model.get('penultimate_login_date')), now));
			}

			// update time since login
			//
			if (this.model.has('ultimate_login_date')) {
				this.$el.find('#time-since-login').html(elapsedTimeToHTML(UTCDateToLocalDate(this.model.get('ultimate_login_date')), now));
			}
		},

		onRender: function() {
			var self = this;
			this.interval = window.setInterval(function() {
				self.updateTime();
			}, 1000);
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			if (this.interval) {
				window.clearInterval(this.interval);
			}
		}
	});
});