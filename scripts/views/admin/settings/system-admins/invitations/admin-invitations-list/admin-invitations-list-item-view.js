/******************************************************************************\
|                                                                              |
|                      admin-invitations-list-item-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows administrator invitations.             |
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
	'text!templates/admin/settings/system-admins/invitations/admin-invitations-list/admin-invitations-list-item.tpl',
	'models/admin/admin-invitation',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-utils'
], function($, _, Template, AdminInvitation, TableListItemView) {
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
				model: this.model,
				url: application.getURL() + '#accounts',
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
				title: "Delete Administrator Invitation",
				message: "Are you sure that you want to delete this administrator invitation to " + this.model.get('invitee').getFullName() + "?",

				// callbacks
				//
				accept: function() {
					var adminInvitation = new AdminInvitation({
						'invitation_key': self.model.get('invitation_key')
					});

					// delete admin invitation
					//
					self.model.destroy({
						url: adminInvitation.url(),

						// callbacks
						//
						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this admin invitation."
							});
						}
					});
				}
			});
		}
	});
});
