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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/registration/verify-email-changed.tpl',
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
							message: "Your new email address has been verified.",

							// callbacks
							//
							accept: function() {
								if( Registry.application.session.user ){
									Registry.application.session.user.set({ user_uid: 'current' });
									Registry.application.session.user.fetch({ 

										// callbacks
										//
										success: function(){

											// go to home view
											//
											Backbone.history.navigate('#home', {
												trigger: true
											});
										}
									});
								} else {

									// go to home view
									//
									Backbone.history.navigate('#home', {
										trigger: true
									});
								}
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
