/******************************************************************************\
|                                                                              |
|                        new-project-invitations-list-view.js                  |
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
	'text!templates/projects/info/members/invitations/new-project-invitations-list/new-project-invitations-list-item.tpl',
	'registry',
	'models/projects/project-invitation',
	'views/dialogs/confirm-view'
], function($, _, Backbone, Marionette, Template, Registry, ProjectInvitation, ConfirmView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click #add': 'onClickAdd',
			'click button.delete': 'onClickDelete',
			'blur .name input': 'onBlurName',
			'blur .email input': 'onBlurEmail',
			'blur .username input': 'onBlurUsername'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
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
				message = "Are you sure you want to delete the invitation of " + this.model.get('invitee_name') + " to the project, " + this.options.project.get('full_name') + "?";
			} else {
				message = "Are you sure you want to delete this invitation to the project, " + this.options.project.get('full_name') + "?";
			}

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete New Project Invitation",
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
			var name = this.$el.find('.name input').val().trim();
			if (name === '') {
				name = undefined;
			}
			this.model.set({
				'invitee_name': name
			});
		},

		onBlurEmail: function() {
			var email = this.$el.find('.email input').val().trim();
			if (email === '') {
				email = undefined;
			}
			this.model.set({
				'invitee_email': email
			});
		},

		onBlurUsername: function() {
			var username = this.$el.find('.username input').val().trim();
			if (username === '') {
				username = undefined;
			}
			this.model.set({
				'invitee_username': username
			});
		}
	});
});
