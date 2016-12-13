/******************************************************************************\
|                                                                              |
|                       project-invitations-list-item-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list a user project invitations.     |
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
	'text!templates/projects/info/members/invitations/project-invitations-list/project-invitations-list-item.tpl',
	'registry',
	'utilities/time/date-format',
	'models/users/user',
	'models/projects/project-invitation',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Template, Registry, DateFormat, User, ProjectInvitation, ConfirmView, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click button.delete': 'onClickDelete'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				User: User,
				model: this.model,
				config: Registry.application.config,
				showDelete: this.options.showDelete
			}));
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Project Invitation",
					message: "Are you sure that you want to delete this invitation of " + this.model.get('invitee_name') + " to project " + self.options.project.get('full_name') + "?",

					// callbacks
					//
					accept: function() {
						var projectInvitation = new ProjectInvitation({
							'invitation_key': self.model.get('invitation_key')
						});

						// delete project invitation
						//
						self.model.destroy({
							url: projectInvitation.url(),

							// callbacks
							//
							success: function() {

								// show success notify
								//
								Registry.application.modal.show(
									new NotifyView({
										message: "This project invitation has successfully been deleted."
									})
								);
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this project invitation."
									})
								);
							}
						});
					}
				})
			);
		}
	});
});
