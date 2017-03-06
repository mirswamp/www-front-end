/******************************************************************************\
|                                                                              |
|                             change-my-password-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for changing the user's password.                 |
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
	'validate',
	'tooltip',
	'popover',
	'text!templates/users/accounts/dialogs/change-password/change-my-password.tpl',
	'registry',
	'utilities/security/password-policy',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Registry, PasswordPolicy, NotifyView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			"click .alert .close": "onClickAlertClose",
			"click #submit": "onClickSubmit",
			"click #reset": "onClickReset",
			"keydown #password": "onKeydownPassword"
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;

			this.model = Registry.application.session.user;
			
			// add password validation rule
			//
			$.validator.addMethod("passwordValid", function(value) {
				var username = self.$el.find("#username").val();
				var passwordRating = $.validator.passwordRating(value, username);
				return (passwordRating.messageKey === "strong");
			}, "Your password does not meet the required criteria.");
		},

		changePassword: function(currentPassword, newPassword) {

			// change current user's password
			//
			this.model.changePassword(currentPassword, newPassword, {

				// callbacks
				//
				success: function() {

					// show success notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							title: "My Password Changed",
							message: "Your user password has been successfully changed.",

							// callbacks
							//
							accept: function() {

								// return to my account view
								//
								Backbone.history.navigate("#my-account", {
									trigger: true
								});
							}
						})
					);
				},

				error: function(response) {

					// get response text
					//
					var responseText = response.responseText;

					// Decode LDAP error messages
					//
					if (responseText.contains('{')) {

						// response is in JSON format
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
							  responseText = responseText.replace(regex,"$1");
							}
						}
					}

					// show error dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "Could not save password changes" + (responseText? ' because "' + responseText + '"' : '') + "."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				passwordPolicy: passwordPolicy
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// validate form
			//
			this.validator = this.validate();
		},

		showWarning: function() {
			this.$el.find(".alert-warning").show();
		},

		hideWarning: function() {
			this.$el.find(".alert-warning").hide();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find("form").validate({
				rules: {
					"password": {
						required: true,
						passwordValid: true
					},
					"confirm-password": {
						required: true,
						equalTo: "#new-password"
					}
				},
				messages: {
					"password": {
						required: "Enter a password."
					},
					"confirm-password": {
						required: "Re-enter your password.",
						equalTo: "Enter the same password as above."
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickSubmit: function() {

			// check validation
			//
			if (this.isValid()) {

				// get values from form
				//
				var currentPassword = this.$el.find("#current-password").val();
				var newPassword = this.$el.find("#new-password").val();
				var confirmPassword = this.$el.find("#confirm-password").val();

	 			// confirm password spelling
				//
				if (newPassword !== confirmPassword) {
					this.$el.find(".error").html("Passwords do not match. ");
					this.$el.find(".alert").show();
				} else {
					this.changePassword(currentPassword, newPassword);
				}
			} else {

				// display error message
				//
				this.showWarning();
			}
		},

		onClickReset: function() {
			require([
				'views/users/authentication/dialogs/reset-password-view'
			], function (ResetPasswordView) {

				// show reset password view
				//
				Registry.application.modal.show(
					new ResetPasswordView({
						username: Registry.application.session.user.get('username'),
						parent: this
					})
				);
			});
		},
		
		onKeydownPassword: function(event) {
			var maxlength = $(event.currentTarget).attr("maxlength");
			if (maxlength) {
				var length = event.currentTarget.value.length;
				if (length >= maxlength) {

					// show password length notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "Your password may not exceed " + maxlength + " characters in length."
						})
					);
				}
			}
		}
	});
});
