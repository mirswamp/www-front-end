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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/registration/email/verify-email.tpl',
	'views/base-view',
], function($, _, Template, BaseView) {
	return BaseView.extend({

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

					// show success notification message
					//
					application.notify({
						message: "Your email address has been verified.  You may now begin to use the SWAMP.",

						// callbacks
						//
						accept: function() {

							// go to welcome view
							//
							application.navigate('#sign-in');
						}
					});
				},

				error: function(response) {
					if (response.status <= 500) {

						// show notification
						//
						application.notify({
							message: response.responseText
						});
					} else {

						// show error message
						//
						application.error({
							message: response.responseText
						});
					}
				}
			});
		}
	});
});
