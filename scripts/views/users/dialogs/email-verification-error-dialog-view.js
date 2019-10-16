/******************************************************************************\
|                                                                              |
|                   email-verification-error-dialog-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an error dialog that is shown if a user with an          |
|        unverified email address tries to login.                              |
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
	'text!templates/users/dialogs/email-verification-error-dialog.tpl',
	'models/users/email-verification',
	'views/dialogs/dialog-view',
], function($, _, Template, EmailVerification, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'submit': 'onSubmit',
			'click #resend': 'onClickResend'
		},

		//
		// event handling methods
		//

		onSubmit: function() {

			// perform callback
			//
			if (this.options.accept) {
				this.options.accept();
			}

			// close dialog
			//
			this.hide();

			// disable default form submission
			//
			return false;
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

					// show error message
					//
					application.error({
						message: "Could not resend email verification."
					});
				}
			});

		}
	});
});
