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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/info/members/invitations/please-register.tpl',
	'views/base-view',
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #register': 'onClickRegister',
			'click #decline': 'onClickDecline'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				sender: this.options.sender,
				project: this.options.project
			};
		},

		//
		// event handling methods
		//

		onClickRegister: function() {

			// go to register view
			//
			application.navigate('#register');
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
					application.notify({
						title: "Invitation Declined",
						message: "Your invitation to the project '" + self.options.project.get('full_name') + "' by " + self.options.sender.getFullName() + " has been declined.",

						// callbacks
						//
						accept: function() {

							// go to home view
							//
							application.navigate('#home');
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not decline this project invitation."
					});
				}
			});
		}
	});
});