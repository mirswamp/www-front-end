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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/info/members/invitations/project-invitations-list/project-invitations-list-item.tpl',
	'utilities/time/date-format',
	'models/users/user',
	'models/projects/project-invitation',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, DateFormat, User, ProjectInvitation, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				User: User,
				model: this.model,
				config: application.config,
				showDelete: this.options.showDelete
			};
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
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
						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this project invitation."
							});
						}
					});
				}
			});
		}
	});
});
