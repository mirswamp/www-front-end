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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/settings/system-admins/invitations/invite-admins.tpl',
	'registry',
	'models/admin/admin-invitation',
	'collections/admin/admin-invitations',
	'collections/users/users',
	'views/dialogs/error-view',
	'views/dialogs/notify-view',
	'views/admin/settings/system-admins/invitations/admin-invitations-list/admin-invitations-list-view',
	'views/admin/settings/system-admins/invitations/new-admin-invitations-list/new-admin-invitations-list-view'
], function($, _, Backbone, Marionette, Template, Registry, AdminInvitation, AdminInvitations, Users, ErrorView, NotifyView, AdminInvitationsListView, NewAdminInvitationsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			adminInvitationsList: '#admin-invitations-list',
			newAdminInvitationsList: '#new-admin-invitations-list'
		},

		events: {
			'click #add': 'onClickAdd',
			'click #send': 'onClickSend',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {

			// create collection of invitations
			//
			this.collection = new AdminInvitations([]);
		},

		send: function() {
			var self = this;

			// post notification if no admin invitations
			//
			if (this.collection.length === 0) {

				// show no new invitations notification dialog
				//
				Registry.application.modal.show(
					new NotifyView({
						message: "There are no new administrator invitations to send."
					})
				);
			}

			this.collection.send({

				// callbacks
				//
				success: function() {

					// update
					//
					self.fetchAndShowAdminInvitations();

					// show success notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							title: "Administrator Invitations Sent",
							message: "Your administrator invitations have been sent.",
						})
					);
				},

				error: function(response) {

					// update
					//
					self.fetchAndShowAdminInvitations();
					
					// show notify dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: response.responseText
						})
					);

					/*
					Registry.application.modal.show(
						new NotifyView({
							message: "Could not send administrator invitations."
						})
					);
					*/
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch admin invitations."
						})
					);
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
			this.adminInvitationsList.show(
				new AdminInvitationsListView({
					model: this.model,
					collection: collection,
					showDelete: true
				})
			);
		},

		fetchAndShowAdminInvitations: function() {
			var self = this;
			this.fetchAdminInvitations(function(collection) {
				self.showAdminInvitations(collection);
			});
		},

		/*
		showAdminInvitations: function() {
			var self = this;
			var collection = new AdminInvitations([]);

			// fetch admin invitations
			//
			collection.fetch({

				// callbacks
				//
				success: function() {
					var invitees = new Users();

					// fetch invitees associated with admin invitations
					//
					invitees.fetchByInvitees({

						// callbacks
						//
						success: function() {
							var inviters = new Users();

							// fetch inviters associated with admin invitations
							//
							inviters.fetchByInviters({

								// callbacks
								//
								success: function() {

									// show admin invitations
									//
									self.adminInvitationsList.show(
										new AdminInvitationsListView({
											model: self.model,
											collection: collection,
											invitees: invitees,
											inviters: inviters
										})
									);
								},

								error: function() {

									// show error dialog
									//
									Registry.application.modal.show(
										new ErrorView({
											message: "Could not fetch inviters associated with admin invitations."
										})
									);
								}
							});
						},

						error: function() {

							// show error dialog
							//
							Registry.application.modal.show(
								new ErrorView({
									message: "Could not fetch invitees associated with admin invitations."
								})
							);
						}
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch admin invitations."
						})
					);
				}
			});
		},
		*/

		showNewAdminInvitations: function() {

			// show admin invitations list view
			//
			this.newAdminInvitationsList.show(
				new NewAdminInvitationsListView({
					model: this.model,
					collection: this.collection,
					showDelete: true
				})
			);
		},

		//
		// event handling methods
		//

		onClickAdd: function() {

			// add new admin invitation
			//
			this.collection.add(new AdminInvitation({
				'project_uid': this.model? this.model.get('project_uid') : undefined,
				'inviter_uid': Registry.application.session.user.get('user_uid'),
				'status': 'pending',
				'confirm_route': '#settings/admins/invite/confirm'
			}));

			// update list view
			//
			this.newAdminInvitationsList.currentView.render();
		},

		onClickSend: function() {
			if (this.newAdminInvitationsList.currentView.isValid()) {
				this.send();
			} else {
				Registry.application.modal.show(
					new NotifyView({
						message: "This form has errors or is incomplete.  Please fix before sending."
					})
				);		
			}
		},

		onClickCancel: function() {

			// to to admin settings view
			//
			Backbone.history.navigate('#settings/admins', {
				trigger: true
			});
		}
	});
});
