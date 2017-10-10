/******************************************************************************\
|                                                                              |
|                              reset-password-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog box that is used to reset a password.          |
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
	'bootstrap/popover',
	'text!templates/users/authentication/dialogs/reset-password.tpl',
	'registry',
	'utilities/security/password-policy',
	'models/users/password-reset',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, Popover, Template, Registry, PasswordPolicy, PasswordReset, NotifyView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #username': 'onClickUsername',
			'blur #username': 'onBlurUsername',
			'click #email-address': 'onClickEmailAddress',
			'blur #email-address': 'onBlurEmailAddress',
			'click #reset-password': 'onClickResetPassword',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		resetPassword: function(data) {
			var self = this;

			new PasswordReset().save(data, {

				// callbacks
				//
				success: function() {

					// show success notification view
					//
					if (Registry.application.session.user && Registry.application.session.user.isAdmin() && Registry.application.session.user != self.options.user) {
						Registry.application.modal.show(
							new NotifyView({
								message: "Please inform this user to check their inbox for an email with a link that they may use to reset their password."
							})
						);
					} else if (self.options.user) {
						Registry.application.modal.show(
							new NotifyView({
								message: "Please check your inbox for an email with a link that you may use to reset your password."
							})
						);
					} else {
						Registry.application.modal.show(
							new NotifyView({
								message: "If you supplied a valid username or email address you will be sent an email with a link that you may use to reset your password."
							})
						);
					}
				},

				error: function(response) {

					// get response text
					//
					var responseText = response.responseText;

					// check if response is in JSON format
					//
					if (responseText.contains('{')) {

						// Decode LDAP error messages
						//
						var responseJSON = JSON.parse(responseText); 
						if ((responseJSON !== null) && 
							(responseJSON.error !== null) &&
							(responseJSON.error.message !== null)) {

							// Set the additional output to the error message
							//
							responseText = responseJSON.error;

							// Check for extended LDAP password policy module error message
							// like "Constraint violation: 100: password less than 10 chars"
							//
							var regex = /.+: \d\d\d: (.+):.+/;
							if (responseText.match(regex)) {
								responseText = responseText.replace(regex, "$1");
							}
						}
					}

					// show error dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "Your password could not be reset" + (responseText? ' because "' + responseText + '"' : '') + "."
						})
					);
				}
			});
		},

		//
		// querying methods
		//

		getUsername: function() {
			return this.$el.find('#username').val();
		},

		getEmail: function() {
			return this.$el.find('#email-address').val();
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				user: this.options.user,
				passwordPolicy: passwordPolicy
			}));
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
			if (this.$el.find('#username').val() !== '') {

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
			this.$el.find('#username').attr('disabled', 'true');
		},

		onBlurEmailAddress: function() {
			if (this.$el.find('#email-address').val() !== '') {

				// disable email address input
				//
				this.$el.find('#username').attr('disabled', 'true');
			} else {

				// enable email address input
				//
				this.$el.find('#username').removeAttr('disabled');
			}
		},

		onClickResetPassword: function() {

			// get username from options or form
			//
			if (this.options.user) {
				var username = this.options.user.get('username');
			} else {
				var username = this.getUsername();
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

					// show notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "You must supply a user name or email address."
						})
					);
				}
			}

			if (this.options.accept){
				this.options.accept();
			}

			// close dialog
			//
			Registry.application.modal.hide();

			// disable default form submission
			//
			return false;
		},

		onClickCancel: function() {
			if (this.options.reject) {
				this.options.reject();
			}
		}
	});
});
