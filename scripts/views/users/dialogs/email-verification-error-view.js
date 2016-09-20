/******************************************************************************\
|                                                                              |
|                          email-verification-error-view.js                    |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/dialogs/email-verification-error.tpl',
	'registry',
	'models/users/email-verification',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Template, Registry, EmailVerification, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

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
			Registry.application.modal.hide();

			// disable default form submission
			//
			return false;
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {
				this.onSubmit();
				Registry.application.modal.hide();
			}
		},

		onClickResend: function() {

			var emailVerification = new EmailVerification();
			emailVerification.resend(this.options.username, this.options.password, {

				// callbacks
				//
				success: function() {
					Registry.application.modal.show(
						new NotifyView({
							message: "A new verification email has been sent to the email address that you registered with.  Please check your inbox for its arrival.  It make take a few seconds for it to arrive."
						})
					);
				},

				error: function() {
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not resend email verification."
						})
					);
				}
			});

		}
	});
});
