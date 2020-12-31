/******************************************************************************\
|                                                                              |
|                   new-admin-invitations-list-item-view.js                    |
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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'jquery.validate',
	'text!templates/admin/settings/system-admins/invitations/new-admin-invitations-list/new-admin-invitations-list-item.tpl',
	'models/admin/admin-invitation',
	'views/collections/tables/table-list-item-view'
], function($, _, Validate, Template, AdminInvitation, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete',
			'blur .name': 'onBlurName',
			'blur .email': 'onBlurEmail',
			'blur .username': 'onBlurUsername'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			var invitee = this.model.get('invitee');
			var inviter = this.model.get('inviter');

			return {
				invitee_name: invitee? invitee.getFullName() : null,
				invitee_url: invitee? invitee.getAppUrl() : null,
				inviter_name: inviter? inviter.getFullName() : null,
				inviter_url: inviter? inviter.getAppUrl() : null,
				showDelete: this.options.showDelete
			};
		},

		//
		// form validation methods
		//

		isValid: function() {
			if (application.config.email_enabled) {
				return this.$el.find('.email input').val() != '';
			} else {
				return this.$el.find('.username input').val() != '';
			}
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

			// show confirmation
			//
			application.confirm({
				title: "Delete New Administrator Invitation",
				message: message,

				// callbacks
				//
				accept: function() {
					self.model.destroy();
				}
			});
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
