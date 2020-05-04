/******************************************************************************\
|                                                                              |
|                         reset-password-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog box that is used to reset a password.          |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/popover',
	'text!templates/users/authentication/reset-password/dialogs/reset-password-dialog.tpl',
	'models/users/password-reset',
	'views/dialogs/dialog-view',
], function($, _, Popover, Template, PasswordReset, DialogView) {
	'use strict';

	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #swamp-username': 'onClickUsername',
			'blur #swamp-username': 'onBlurUsername',
			'click #email-address': 'onClickEmailAddress',
			'blur #email-address': 'onBlurEmailAddress',
			'click #reset-password': 'onClickResetPassword',
			'click #cancel': 'onClickCancel',
			'keypress': 'onKeyPress'
		},

		//
		// methods
		//

		resetPassword: function(data) {
			var self = this;
			var passwordReset = new PasswordReset({});

			passwordReset.save(data, {

				// callbacks
				//
				success: function() {

					// show success notification
					//
					if (self.options.username) {
						application.notify({
							message: "Please check your inbox for an email with a link that you may use to reset your password."
						});
					} else {
						application.notify({
							message: "If you supplied a valid username or email address you will be sent an email with a link that you may use to reset your password."
						});
					}
				},

				error: function() {

					// show error
					//
					application.error({
						message: "Your password could not be reset."
					});
				}
			});
		},

		//
		// querying methods
		//

		getUsername: function() {
			return this.$el.find('#swamp-username').val();
		},

		getEmail: function() {
			return this.$el.find('#email-address').val();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				show_user: this.options.username == undefined
			};
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		//
		// event handling methods
		//

		onClickUsername: function() {

			// disable email address input
			//
			this.$el.find('#email-address').attr('disabled', 'true');
		},

		onBlurUsername: function() {
			if (this.$el.find('#swamp-username').val() !== '') {

				// disable email address input
				//
				this.$el.find('#email-address').attr('disabled', 'true');
			} else {

				// enable email address input
				//
				this.$el.find('#email-address').removeAttr('disabled');
			}
		},

		onClickEmailAddress: function() {

			// disable user name input
			//
			this.$el.find('#swamp-username').attr('disabled', 'true');
		},

		onBlurEmailAddress: function() {
			if (this.$el.find('#email-address').val() !== '') {

				// disable email address input
				//
				this.$el.find('#swamp-username').attr('disabled', 'true');
			} else {

				// enable email address input
				//
				this.$el.find('#swamp-username').removeAttr('disabled');
			}
		},

		onClickResetPassword: function() {
			var username;

			// get username from options or form
			//
			if (this.options.username) {
				username = this.options.username;
			} else {
				username = this.getUsername();
			}

			// reset password by username or email
			//
			if (username) {
				this.resetPassword({
					'username': username
				});
			} else {
				var email = this.getEmail();
				if (email) {
					this.resetPassword({
						'email': email
					});
				} else {

					// show notification
					//
					application.notify({
						message: "You must supply a user name or email address."
					});
				}
			}

			if (this.options.accept){
				this.options.accept();
			}

			// close dialog
			//
			this.destroy();

			// disable default form submission
			//
			return false;
		},

		onClickCancel: function() {
			if (this.options.reject) {
				this.options.reject();
			}
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {
				this.onClickResetPassword();
			}
		}
	});
});
