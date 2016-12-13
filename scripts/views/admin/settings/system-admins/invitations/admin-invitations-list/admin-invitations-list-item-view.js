/******************************************************************************\
|                                                                              |
|                               admin-invitations-view.js                      |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/settings/system-admins/invitations/admin-invitations-list/admin-invitations-list-item.tpl',
	'registry',
	'models/admin/admin-invitation',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Template, Registry, AdminInvitation, ConfirmView, NotifyView, ErrorView) {
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
				model: this.model,
				url: Registry.application.getURL() + '#accounts',
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

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this admin invitation."
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
