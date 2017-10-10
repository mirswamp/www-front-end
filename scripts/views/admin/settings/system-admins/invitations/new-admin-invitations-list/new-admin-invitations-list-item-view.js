/******************************************************************************\
|                                                                              |
|                           new-admin-invitations-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of new admininstator            |
|        invitations.                                                          |
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
	'jquery.validate',
	'text!templates/admin/settings/system-admins/invitations/new-admin-invitations-list/new-admin-invitations-list-item.tpl',
	'registry',
	'models/admin/admin-invitation',
	'views/dialogs/confirm-view'
], function($, _, Backbone, Marionette, Validate, Template, Registry, AdminInvitation, ConfirmView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click .delete button': 'onClickDelete',
			'blur .name': 'onBlurName',
			'blur .email': 'onBlurEmail',
			'blur .username': 'onBlurUsername'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
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
			var message;

			if (this.model.has('invitee_name')) {
				message = "Are you sure you want to delete the administrator invitation of " + this.model.get('invitee_name') + "?";
			} else {
				message = "Are you sure you want to delete this administrator invitation?";
			}

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete New Administrator Invitation",
					message: message,

					// callbacks
					//
					accept: function() {
						self.model.destroy();
					}
				})
			);
		},

		onBlurName: function() {
			var name = this.$el.find('.name input').val();
			if (name === '') {
				name = undefined;
			}
			this.model.set({
				'invitee_name': name
			});
		},

		onBlurEmail: function() {
			var email = this.$el.find('.email input').val();
			if (email === '') {
				email = undefined;
			}
			this.model.set({
				'email': email
			});
		},

		onBlurUsername: function() {
			var username = this.$el.find('.username input').val();
			if (username === '') {
				username = undefined;
			}
			this.model.set({
				'username': username
			});
		}
	});
});
