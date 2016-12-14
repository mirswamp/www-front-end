/******************************************************************************\
|                                                                              |
|                            change-user-password-view.js                      |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'validate',
	'tooltip',
	'popover',
	'text!templates/users/accounts/dialogs/change-password/change-user-password.tpl',
	'registry',
	'utilities/security/password-policy',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Registry, PasswordPolicy, NotifyView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #submit': 'onClickSubmit',
			'keydown #password': 'onKeydownPassword'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				user: this.model,
				passwordPolicy: passwordPolicy
			}));
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;
			
			// add password validation rule
			//
			$.validator.addMethod('passwordValid', function(value) {
				var username = self.$el.find('#username').val();
				var passwordRating = $.validator.passwordRating(value, username);
				return (passwordRating.messageKey === 'strong');
			}, "Your password does not meet the required criteria.");
		},

		changePassword: function(currentPassword, newPassword) {
			var self = this;

			// change some user's password
			//
			this.model.changePassword(currentPassword, newPassword, {

				// callbacks
				//
				success: function() {

					// show success notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							title: "User Password Changed",
							message: self.model.getFullName() + "'s password has been successfully changed.",

							// callbacks
							//
							accept: function() {

								// return to user account view
								//
								Backbone.history.navigate('#accounts/' + self.model.get('user_uid'), {
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
							message: "Could not save password changes" + (responseText? ' because "' + responseText + '"' : '') + "."

						})
					);
				}
			});
		},

		//
		// rendering methods
		//

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

		showWarning: function(message) {
			this.$el.find('.error').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({
				rules: {
					'password': {
						required: true,
						passwordValid: true
					},
					'confirm-password': {
						required: true,
						equalTo: '#new-password'
					}
				},
				messages: {
					'swamp-password': {
						required: "Enter a password"
					},
					'confirm-password': {
						required: "Re-enter your password",
						equalTo: "Enter the same password as above"
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
				var newPassword = this.$el.find('#new-password').val();
				var confirmPassword = this.$el.find('#confirm-password').val();

	 			// confirm password spelling
				//
				if (newPassword !== confirmPassword) {
					this.$el.find('.error').html("Passwords do not match. ");
					this.$el.find('.alert').show();
				} else {
					this.changePassword(null, newPassword);
				}
			} else {

				// display error message
				//
				this.showWarning();
			}
		},

		onKeydownPassword: function(event) {
			var maxlength = $(event.currentTarget).attr('maxlength');
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
