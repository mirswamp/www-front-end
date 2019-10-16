/******************************************************************************\
|                                                                              |
|                             sign-in-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering authentication info.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/authentication/forms/sign-in-form.tpl',
	'config',
	'views/base-view',
	'views/users/authentication/selectors/auth-provider-selector-view',
], function($, _, Template, Config, BaseView, AuthProviderSelectorView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		className: 'form form-horizontal',

		regions: {
			linked_sign_in: '#linked-account-sign-in'
		},

		events: {
			'click .alert-warning .close': 'onClickAlertWarningClose',
			'click .alert-info .close': 'onClickAlertInfoClose',
			'input input': 'onChange',
			'click #reset-password': 'onClickResetPassword',
			'click #request-username': 'onClickRequestUsername',
		},

		//
		// methods
		//

		login: function(username, password, options) {
			var self = this;

			// remove auth provider from saved options
			//
			application.options.authProvider = null;
			application.saveOptions();

			// send login request
			//
			application.session.login(username, password, {
				crossDomain: true,
				
				// callbacks
				//
				success: function() {

					// sign in user
					//
					if (options.success) {
						options.success();
					}
				},

				error: function(response, statusText, errorThrown) {

					// check for unverified email
					//
					if (response.responseText == "User email has not been verified.") {
						self.showEmailVerificationError(username, password);

					// check for unauthorized request
					//
					} else if (response.status == 401) {
						self.showWarning(response.responseText);

					// check for blocked request
					//
					} else if (response.status == 403) {
						window.location = application.getURL() + 'block/index.html';

					// check for bad request
					//
					} else if (response.status == 400) {
						self.showWarning("Login failed. Please clear your cookies and try again.");
					
					// check for conflict
					//
					} else if (response.status == 409) {
						var email = (Config.contact && Config.contact.security)?
							Config.contact.security.email : undefined;
						var phoneNumber = (Config.contact && Config.contact.support)?
							Config.contact.support.phoneNumber : undefined;

						// compose error message;
						//
						var message = response.responseText;

						// add support info
						//
						if (email || phoneNumber) {
							if (message != '') {
								message += ' ';
							}
							message += "If you have any questions, ";
							if (email) {
								message += "email us at " + email;
							}
							if (phoneNumber) {
								if (email) {
									message += " or ";
								}
								message += "call our 24/7 support line at " + phoneNumber;
							}
							message += '.';
						}

						self.showInfo(message);

						// disable ok button
						//
						self.$el.find("#ok").prop('disabled', true);

					// check for empty response
					//
					} else if (response.responseText == '') {
						self.showWarning("Log in request failed. Can not connect to server.");
					
					// unknown error
					//
					} else {

						// show error message
						//
						application.error({
							message: response.responseText
						});
					}
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				config: application.config
			};
		},

		onShow: function() {

			// show linked account sign in
			//
			if (application.config['linked_accounts_enabled']) {
				this.showLinkedAccountForm();
			}
		},

		showLinkedAccountForm: function() {
			var self = this;
			require([
				'views/users/authentication/forms/linked-account-sign-in-form-view',
			], function (LinkedAccountSignInFormView) {
				self.showChildView('linked_sign_in', new LinkedAccountSignInFormView({
					parent: self,

					// callbacks
					//
					onShowProviders: function() {
						self.showProviders();
						self.onChange();
					},
					onHideProviders: function() {
						self.hideProviders();
						self.onChange();
					}
				}));

				// configure form view
				//
				if (application.options.authProvider) {
					self.showProviders();
				}
			});
		},

		showEmailVerificationError: function(username, password) {
			require([
				'views/users/dialogs/email-verification-error-dialog-view',
			], function (EmailVerificationErrorDialogView) {
				application.show(new EmailVerificationErrorDialogView({
					username: username,
					password: password
				}));
			});
		},

		showProviders: function() {
			this.$el.find('.local-account').hide();
			this.$el.find('.linked-account').show();
		},

		hideProviders: function() {
			this.options.parent.$el.find('.local-account').show();
			this.options.parent.$el.find('.linked-account').hide();
		},

		showWarning: function(message) {
			this.$el.find('.alert-warning .message').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		showInfo: function(message) {
			this.$el.find('.alert-info .message').html(message);
			this.$el.find('.alert-info').show();
		},

		hideInfo: function() {
			this.$el.find('.alert-info').hide();
		},

		showUsernamePassword: function() {
			this.$el.find('#username').show();
			this.$el.find('#password').show();
		},

		hideUsernamePassword: function() {
			this.$el.find('#username').hide();
			this.$el.find('#password').hide();
		},

		//
		// form methods
		//

		focus: function() {
			this.$el.find('#username input').focus();
		},

		getValues: function() {
			return {
				username: this.$el.find('#username input').val(),
				password: this.$el.find('#password input').val()
			};
		},

		submit: function(options) {
			if (application.config['linked_accounts_enabled'] &&
				this.getChildView('linked_sign_in').useLinkedAccount) {

				// sign in using linked account
				//
				this.getChildView('linked_sign_in').submit();
			} else {
				var values = this.getValues();

				// make request
				//
				this.login(values.username, values.password, options);
			}
		},

		//
		// form validation methods
		//

		isValid: function() {
			/*
			if (application.config['linked_accounts_enabled']) {
				return this.validator.form() || this.getChildView('linked_sign_in').isValid();
			} else {
				return this.validator.form();
			}
			*/

			// check if using linked accounts form
			//
			if (application.config['linked_accounts_enabled']) {
				if (this.getChildView('linked_sign_in') && this.getChildView('linked_sign_in').useLinkedAccount) {
					return true;
				}
			}
			
			// check if username and password are filled in
			//
			return (this.$el.find('#username input').val() != '') && 
				(this.$el.find('#password input').val() != '');
		},

		//
		// event handling methods
		//

		onChange: function() {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onClickAlertWarningClose: function() {
			this.hideWarning();
		},

		onClickAlertInfoClose: function() {
			this.hideInfo();
		},

		onClickResetPassword: function() {
			require([
				'views/users/authentication/dialogs/reset-password-dialog-view'
			], function (ResetPasswordDialogView) {

				// show reset password view
				//
				application.show(new ResetPasswordDialogView({
					parent: this
				}));
			});
		},

		onClickRequestUsername: function() {
			require([
				'views/users/authentication/dialogs/request-username-dialog-view'
			], function (RequestUsernameDialogView) {

				// show request username view
				//
				application.show(new RequestUsernameDialogView({
					parent: this
				}));
			});
		}
	});
});
