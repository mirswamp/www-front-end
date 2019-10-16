/******************************************************************************\
|                                                                              |
|                          confirm-admin-invitation-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows project invitation confirmation.       |
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
	'text!templates/admin/settings/system-admins/invitations/confirm-admin-invitation.tpl',
	'models/admin/admin',
	'views/base-view',
], function($, _, Template, Admin, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #accept': 'onClickAccept',
			'click #decline': 'onClickDecline'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				inviter: this.model.get('inviter'),
				invitee: this.model.get('invitee')
			};
		},

		//
		// event handling methods
		//

		onClickAccept: function() {
			var self = this;

			// send accept request
			//
			this.model.accept({

				// callbacks
				//
				success: function() {

					// show invitation accepted notify dialog
					//
					application.notify({
						title: "Administrator Invitation Accepted",
						message: "Congratulations, " + self.model.get('invitee').getFullName() + ".  You are now a SWAMP administrator.",

						// callbacks
						//
						accept: function() {

							// go to home view
							//
							Backbone.history.navigate('#home', {
								trigger: true
							});
							window.location.reload();
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not accept administrator invitation."
					});
				}
			});
		},

		onClickDecline: function() {
			var self = this;

			// send decline request
			//
			this.model.decline({

				// callbacks
				//
				success: function(data) {

					// update model
					//
					self.model.set(data);

					// show declined notification dialog
					//
					application.notify({
						title: "Administrator Invitation Declined",
						message: "Your invitation to become a SWAMP administrator has been declined. ",

						// callbacks
						//
						accept: function() {

							// go to home view
							//
							Backbone.history.navigate('#home', {
								trigger: true
							});
							window.location.reload();
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not decline administrator invitation."
					});
				}
			});
		}
	});
});
