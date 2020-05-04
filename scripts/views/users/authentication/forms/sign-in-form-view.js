/******************************************************************************\
|                                                                              |
|                              sign-in-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view used for user authentication.                |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'bootstrap/popover',
	'text!templates/users/authentication/forms/sign-in-form.tpl',
	'views/forms/form-view',
	'views/users/registration/dialogs/email-verification-error-dialog-view'
], function($, _, Config, Popover, Template, FormView, EmailVerificationErrorDialogView) {
	'use strict';

	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #reset-password': 'onClickResetPassword',
			'click #request-username': 'onClickRequestUsername',
			'keypress': 'onKeyPress'
		},

		//
		// form methods
		//

		getValue: function(key, value) {
			switch (key) {
				case 'username':
					return this.$el.find('.username input').val();
				case 'password':
					return this.$el.find('.password input').val();
			}
		},

		getValues: function() {
			return {
				username: this.getValue('username'),
				password: this.getValue('password')
			};
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
		},

		showWarning: function(message) {
			this.$el.find('.alert-warning .message').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// methods
		//

		submit: function(options) {
			var self = this;
			var values = this.getValues();

			// send login request
			//
			application.session.login(values.username, values.password, {
				crossDomain: true,
				
				// callbacks
				//
				success: function() {

					// perform callback
					//
					if (options && options.success) {
						options.success();
					}
				},

				error: function(response, statusText, errorThrown) {
					if (response.status == 403) {
						window.location = application.getURL() + 'block/index.html';
					} else {
						if (response.responseText == "User email has not been verified.") {
							application.show(new EmailVerificationErrorDialogView({
								username: values.username,
								password: values.password
							}));
						} else if (response.responseText == '') {
							self.showWarning("Log in request failed. It appears that you may have lost internet connectivity.  Please check your internet connection and try again.");
						} else {
							self.showWarning(response.responseText);
						}
					}
				}
			});
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickResetPassword: function() {
			require([
				'views/users/authentication/reset-password/dialogs/reset-password-dialog-view'
			], function (ResetPasswordDialogView) {

				// show reset password dialog
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

				// show request username dialog
				//
				application.show(new RequestUsernameDialogView({
					parent: this
				}));
			});
		}
	});
});
