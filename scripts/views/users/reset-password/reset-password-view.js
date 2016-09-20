/******************************************************************************\
|                                                                              |
|                               reset-password-view.js                         |
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
	'text!templates/users/reset-password/reset-password.tpl',
	'registry',
	'utilities/password-policy',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Registry, PasswordPolicy, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #submit': 'onClickSubmit',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;
			
			// add password validation rule
			//
			$.validator.addMethod('passwordValid', function(value) {
				var username = self.options.user.get('username');
				var passwordRating = $.validator.passwordRating(value, username);
				return (passwordRating.messageKey === 'strong');
			}, "Your password does not meet the required criteria.");
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

			// validate form
			//
			this.validator = this.validate();
		},

		showWarning: function() {
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
						equalTo: '#password'
					}
				},
				messages: {
					'password': {
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

		onClickSubmit: function() {
			var self = this;

			// check validation
			//
			if (this.isValid()) {

				// get values from form
				//
				var password = this.$el.find('#password').val();
				var confirmPassword = this.$el.find('#confirm-password').val();

				// confirm password spelling
				//
				if (password !== confirmPassword) {
					this.$el.find('.error').html("Passwords do not match. ");
					this.$el.find('.alert').show();
					return;
				}

				// change password
				//
				this.options.user.resetPassword( password, {
					password_reset_key: this.model.get('password_reset_key'),
					password_reset_id: this.model.get('password_reset_id'),

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

									// go home
									//
									Backbone.history.navigate('#home', {
										trigger: true
									});
									window.location.reload();
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
								message: "Your password could not be reset" + (responseText? ' because "' + responseText + '"' : '') + "."
							})
						);
					}	
				});
			} else {

				// display error message
				//
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go home
			//
			Backbone.history.navigate('#home', {
				trigger: true
			});
			window.location.reload();
		}

	});
});

