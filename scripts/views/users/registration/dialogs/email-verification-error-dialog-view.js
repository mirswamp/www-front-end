/******************************************************************************\
|                                                                              |
|                     email-verification-error-dialog-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an error dialog that is shown if a user with an          |
|        unverified email address tries to login.                              |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/registration/dialogs/email-verification-error-dialog.tpl',
	'models/users/email-verification',
	'views/dialogs/dialog-view'
], function($, _, Template, EmailVerification, DialogView) {
	'use strict';

	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'submit': 'onSubmit',
			'keypress': 'onKeyPress',
			'click #resend': 'onClickResend'
		},

		//
		// event handling methods
		//

		onSubmit: function() {
			if (this.options.accept) {
				this.options.accept();
			}

			// close modal dialog
			//
			this.dialog.hide();

			// disable default form submission
			//
			return false;
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {
				
				// close modal dialog
				//
				this.dialog.hide();

				// perform callback
				//
				this.onSubmit();
			}
		},

		onClickResend: function() {
			var emailVerification = new EmailVerification();
			emailVerification.resend(this.options.username, this.options.password, {

				// callbacks
				//
				success: function() {

					// show notification
					//
					application.notify({
						message: "A new verification email has been sent to the email address that you registered with.  Please check your inbox for its arrival.  It make take a few seconds for it to arrive."
					});
				},

				error: function() {

					// show error
					//
					application.error({
						message: "Could not resend email verification."
					});
				}
			});

		}
	});
});