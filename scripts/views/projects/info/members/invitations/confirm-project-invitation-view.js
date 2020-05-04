/******************************************************************************\
|                                                                              |
|                        confirm-project-invitation-view.js                    |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/info/members/invitations/confirm-project-invitation.tpl',
	'models/projects/project-membership',
	'views/base-view',
], function($, _, Template, ProjectMembership, BaseView) {
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
				sender: this.options.sender,
				project: this.options.project,
				user: this.options.user
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

					// show success notify message
					//
					application.notify({
						title: "Project Membership Accepted",
						message: "Congratulations, " + self.model.get('invitee_name') + ".  You are now a member of the project '" + self.options.project.get('full_name') + "'.",

						// callbacks
						//
						accept: function() {

							// go to home view
							//
							application.navigate('#home');
							window.location.reload();
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not accept project invitation."
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
				success: function() {

					// show success notify view
					//
					application.notify({
						title: "Project Membership Declined",
						message: "Your invitation to the project '" + self.options.project.get('full_name') + "' by " + self.options.sender.getFullName() + " has been declined.",

						// callbacks
						//
						accept: function() {

							// go to home view
							//
							application.navigate('#home');
							window.location.reload();
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not decline project invitation."
					});
				}
			});
		}
	});
});
