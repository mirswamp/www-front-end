/******************************************************************************\
|                                                                              |
|                          verify-email-changed-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view where users can verify their email                |
|        address modification requests.                                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/registration/email/verify-email-changed.tpl',
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
						message: "Your new email address has been verified.",

						// callbacks
						//
						accept: function() {
							if( application.session.user ){
								application.session.user.set({ user_uid: 'current' });
								application.session.user.fetch({ 

									// callbacks
									//
									success: function(){

										// go to home view
										//
										application.navigate('#home');
									}
								});
							} else {

								// go to home view
								//
								application.navigate('#home');
							}
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
