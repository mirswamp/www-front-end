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
	'text!templates/users/authentication/forms/sign-in-form.tpl',
	'config',
	'registry',
	'views/dialogs/error-view',
	'views/users/dialogs/email-verification-error-view',
	'views/users/authentication/forms/federated-sign-in-form-view'
], function($, _, Backbone, Marionette, Popover, Template, Config, Registry, ErrorView, EmailVerificationErrorView, FederatedSignInFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		className: 'form-horizontal',

		events: {
			'click .alert-warning .close': 'onClickAlertWarningClose',
			'click .alert-info .close': 'onClickAlertInfoClose',
			'click #reset-password': 'onClickResetPassword',
			'click #request-username': 'onClickRequestUsername',
		},

		//
		// rendering methods
		//

		template: function(){
			return _.template(Template, {
				config: Registry.application.config
			});
		},

		onRender: function() {

			// add federated sign in
			//
			if (Registry.application.config['federated_authentication_enabled'] || 
				Registry.application.config['github_authentication_enabled']) {

				// add regions
				//
				this.addRegions({
					federatedSignInForm: '#federated-sign-in-form'
				});

				// show subviews
				//
				this.federatedSignInForm.show(
					new FederatedSignInFormView()
				);
			}

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

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

		//
		// methods
		//

		submit: function(options) {
			var self = this;

			// get parameters
			//
			var username = this.$el.find('#username').val();
			var password = this.$el.find('#password').val();

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
						Registry.application.modal.show(
							new EmailVerificationErrorView({
								username: username,
								password: password
							})
						);

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
		// event handling methods
		//

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
