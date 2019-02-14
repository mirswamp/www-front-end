/******************************************************************************\
|                                                                              |
|                              verify-email-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view where users can verify their email                |
|        address in order to activate their accounts.                          |
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
	'backbone',
	'marionette',
	'text!templates/users/registration/verify-email.tpl',
	'registry',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Template, Registry, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		
		events: {
			'click #verify': 'onClickVerify'
		},

		//
		// event handling methods
		//

		onClickVerify: function() {

			// verify email
			//
			this.model.verify({

				// callbacks
				//
				success: function() {

					// show success notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "Your email address has been verified.  You may now begin to use the SWAMP.",

							// callbacks
							//
							accept: function() {

								// go to welcome view
								//
								Backbone.history.navigate('#sign-in', {
									trigger: true
								});
							}
						})
					);
				},

				error: function(response) {

					if (response.status <= 500) {

						// show notify dialog
						//
						Registry.application.modal.show(
							new NotifyView({
								message: response.responseText
							})
						);
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
		}
	});
});
