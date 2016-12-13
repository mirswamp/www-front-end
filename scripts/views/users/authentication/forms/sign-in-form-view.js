/******************************************************************************\
|                                                                              |
|                               sign-in-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for authenticating (signing in) users.            |
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
	'popover',
	'validate',
	'text!templates/users/authentication/forms/sign-in-form.tpl',
	'config',
	'registry',
	'views/users/authentication/selectors/auth-provider-selector-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Popover, Validate, Template, Config, Registry, AuthProviderSelectorView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		tagName: 'form',
		className: 'form-horizontal',

		regions: {
			linkedAccountSignIn: '#linked-account-sign-in'
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
			Registry.application.options.authProvider = null;
			Registry.application.saveOptions();

			// send login request
			//
			Registry.application.session.login(username, password, {
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
						window.location = Registry.application.getURL() + 'block/index.html';

					// check for bad request
					//
					} else if (response.status == 400) {
						self.showWarning("Login failed. Please clear your cookies for mir-swamp.org and try again.");
					
					// check for conflict
					//
					} else if (response.status == 409) {
						self.showInfo(response.responseText + "  " +
							"If you have any questions, email us at " + Config.contact.security.email + " or call our 24/7 support line at " + Config.contact.support.phoneNumber);

						// disable ok button
						//
						self.$el.find("#ok").prop('disabled', true);

					// check for empty response
					//
					} else if (response.responseText == '') {
						self.showWarning("Log in request failed. It appears that you may have lost internet connectivity.  Please check your internet connection and try again.");
					
					// unknown error
					//
					} else {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: response.responseText
							})
						);
					}
				}
			});
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				config: Registry.application.config
			});
		},

		onRender: function() {
			var self = this;

			// show linked account sign in
			//
			if (Registry.application.config['linked_accounts_enabled']) {
				this.showLinkedAccountForm();
			}

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// perform initial validation
			//
			//this.validate();
		},

		showLinkedAccountForm: function() {
			var self = this;
			require([
				'views/users/authentication/forms/linked-account-sign-in-form-view',
			], function (LinkedAccountSignInFormView) {
				self.linkedAccountSignIn.show(
					new LinkedAccountSignInFormView({
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
					})
				);

				// configure form view
				//
				if (Registry.application.options.authProvider) {
					self.showProviders();
				}
			});
		},

		showEmailVerificationError: function(username, password) {
			require([
				'views/users/dialogs/email-verification-error-view',
			], function (EmailVerificationErrorView) {
				Registry.application.modal.show(
					new EmailVerificationErrorView({
						username: username,
						password: password
					})
				);
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

		submit: function(options) {
			if (Registry.application.config['linked_accounts_enabled'] &&
				this.linkedAccountSignIn.currentView.useLinkedAccount) {

				// sign in using linked account
				//
				this.linkedAccountSignIn.currentView.submit();
			} else {

				// get parameters
				//
				var username = this.$el.find('#username input').val();
				var password = this.$el.find('#password input').val();

				// make request
				//
				this.login(username, password, options);
			}
		},

		//
		// form validation methods
		//

		validate: function() {
			this.validator = this.$el.validate();
		},

		isValid: function() {
			/*
			if (Registry.application.config['linked_accounts_enabled']) {
				return this.validator.form() || this.linkedAccountSignIn.currentView.isValid();
			} else {
				return this.validator.form();
			}
			*/

			// check if using linked accounts form
			//
			if (Registry.application.config['linked_accounts_enabled']) {
				if (this.linkedAccountSignIn.currentView && this.linkedAccountSignIn.currentView.useLinkedAccount) {
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
				'views/users/authentication/dialogs/reset-password-view'
			], function (ResetPasswordView) {

				// show reset password view
				//
				Registry.application.modal.show(
					new ResetPasswordView({
						parent: this
					})
				);
			});
		},

		onClickRequestUsername: function() {
			require([
				'views/users/authentication/dialogs/request-username-view'
			], function (RequestUsernameView) {

				// show request username view
				//
				Registry.application.modal.show(
					new RequestUsernameView({
						parent: this
					})
				);
			});
		}
	});
});
