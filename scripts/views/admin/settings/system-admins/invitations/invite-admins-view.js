/******************************************************************************\
|                                                                              |
|                               invite-admins-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for inviting new system administrators.         |
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
	'text!templates/admin/settings/system-admins/invitations/invite-admins.tpl',
	'models/admin/admin-invitation',
	'collections/admin/admin-invitations',
	'collections/users/users',
	'views/base-view',
	'views/admin/settings/system-admins/invitations/admin-invitations-list/admin-invitations-list-view',
	'views/admin/settings/system-admins/invitations/new-admin-invitations-list/new-admin-invitations-list-view'
], function($, _, Template, AdminInvitation, AdminInvitations, Users, BaseView, AdminInvitationsListView, NewAdminInvitationsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#admin-invitations-list',
			new: '#new-admin-invitations-list'
		},

		events: {
			'click #add': 'onClickAdd',
			'click #send': 'onClickSend',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {

			// create collection of invitations
			//
			this.collection = new AdminInvitations([]);
		},

		//
		// methods
		//

		send: function() {
			var self = this;

			// post notification if no admin invitations
			//
			if (this.collection.length === 0) {

				// show no new invitations notification dialog
				//
				application.notify({
					message: "There are no new administrator invitations to send."
				});
			}

			this.collection.send({

				// callbacks
				//
				success: function() {

					// update
					//
					window.setTimeout(function() {
						self.fetchAndShowAdminInvitations();
					}, 1000);
					
					// show success notification dialog
					//
					application.notify({
						title: "Administrator Invitations Sent",
						message: "Your administrator invitations have been sent.",
					});
				},

				error: function(response) {

					// update
					//
					window.setTimeout(function() {
						self.fetchAndShowAdminInvitations();
					}, 1000);
					
					// show notification
					//
					application.notify({
						message: response.responseText || "Could not send all administrator invitations."
					});
				}
			});
		},

		//
		// ajax methods
		//

		fetchAdminInvitations: function(done) {
			var self = this;
			var collection = new AdminInvitations([]);

			collection.fetch({

				// callbacks
				//
				success: function() {
					done(collection);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch admin invitations."
					});
				}
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			this.fetchAndShowAdminInvitations();
			this.showNewAdminInvitations();
		},

		showAdminInvitations: function(collection) {
			this.showChildView('list', new AdminInvitationsListView({
				model: this.model,
				collection: collection,
				showDelete: true
			}));
		},

		fetchAndShowAdminInvitations: function() {
			var self = this;
			this.fetchAdminInvitations(function(collection) {
				self.showAdminInvitations(collection);
			});
		},

		showNewAdminInvitations: function() {

			// show admin invitations list view
			//
			this.showChildView('new', new NewAdminInvitationsListView({
				model: this.model,
				collection: this.collection,
				showDelete: true
			}));
		},

		//
		// event handling methods
		//

		onClickAdd: function() {

			// add new admin invitation
			//
			this.collection.add(new AdminInvitation({
				'project_uid': this.model? this.model.get('project_uid') : undefined,
				'inviter_uid': application.session.user.get('user_uid'),
				'status': 'pending',
				'confirm_route': '#settings/admins/invite/confirm'
			}));

			// update list view
			//
			this.getChildView('new').render();
		},

		onClickSend: function() {
			if (this.getChildView('new').isValid()) {
				this.send();
			} else {

				// show notification
				//
				application.notify({
					message: "This form has errors or is incomplete.  Please fix before sending."
				});
			}
		},

		onClickCancel: function() {

			// to to admin settings view
			//
			application.navigate('#settings/admins');
		}
	});
});
