/******************************************************************************\
|                                                                              |
|                              please-register-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows project invitation confirmation        |
|        in the case that a user is not yet registered for the SWAMP.          |
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
	'text!templates/projects/info/members/invitations/please-register.tpl',
	'registry',
	'views/dialogs/error-view',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, Template, Registry, ErrorView, NotifyView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #register': 'onClickRegister',
			'click #decline': 'onClickDecline'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				sender: this.options.sender,
				project: this.options.project
			}));
		},

		//
		// event handling methods
		//

		onClickRegister: function() {

			// go to register view
			//
			Backbone.history.navigate('#register', {
				trigger: true
			});
		},

		onClickDecline: function() {
			var self = this;

			// decline project invitation
			//
			this.model.decline({

				// callbacks
				//
				success: function() {

					// show invitation declined notify dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							title: "Invitation Declined",
							message: "Your invitation to the project '" + self.options.project.get('full_name') + "' by " + self.options.sender.getFullName() + " has been declined.",

							// callbacks
							//
							accept: function() {

								// go to home view
								//
								Backbone.history.navigate('#home', {
									trigger: true
								});
							}
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not decline this project invitation."
						})
					);
				}
			});
		}
	});
});