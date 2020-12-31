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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
  'jquery',
  'underscore',
  'text!templates/users/accounts/user-profile/user-profile.tpl',
  'views/base-view',
  'utilities/time/time-utils',
  'utilities/time/date-utils'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				myProfile: this.model && this.model.isCurrentUser(),
				showUserType: application.session.user.isAdmin()
			};
		},

		updateTime: function() {
			var now = new Date();

			// update time since last login
			//
			if (this.model.has('penultimate_login_date')) {
				this.$el.find('#time-since-previous-login').html(elapsedTimeToHTML(this.model.get('penultimate_login_date'), now));
			}

			// update time since login
			//
			if (this.model.has('ultimate_login_date')) {
				this.$el.find('#time-since-login').html(elapsedTimeToHTML(this.model.get('ultimate_login_date'), now));
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