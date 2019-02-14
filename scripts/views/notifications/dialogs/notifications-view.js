/******************************************************************************\
|                                                                              |
|                              notifications-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show              |
|        pending notifications.                                                |
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
	'text!templates/notifications/dialogs/notifications.tpl',
	'registry',
	'collections/projects/project-invitations',
	'collections/admin/admin-invitations',
	'collections/permissions/user-permissions',
	'views/notifications/list/notifications-list-view'
], function($, _, Backbone, Marionette, Template, Registry, ProjectInvitations, AdminInvitations, UserPermissions, NotificationsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			'notifications': '#notifications'
		},

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Backbone.Collection();
		},

		//
		// ajax methods
		//

		fetchProjectInvitations: function(done) {
			var projectInvitations = new ProjectInvitations();
			projectInvitations.fetchPendingByUser(Registry.application.session.user, {

				// callbacks
				//
				success: function() {
					done(projectInvitations);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch project invitations."
						})
					);
				}
			})
		},

		fetchAdminInvitations: function(done) {
			var adminInvitations = new AdminInvitations();
			adminInvitations.fetchPendingByUser(Registry.application.session.user, {

				// callbacks
				//
				success: function() {
					done(adminInvitations);
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
			})
		},

		fetchPendingUserPermissions: function(done) {
			var userPermissions = new UserPermissions();
			userPermissions.fetchPending({

				// callbacks
				//
				success: function() {
					done(userPermissions);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch pending permissions."
						})
					);
				}
			})
		},

		fetchUserNotifications: function(done) {
			var self = this;

			// fetch pending project invitations
			//
			this.fetchProjectInvitations(function(projectInvitations) {

				// fetch pending admin invitations
				//
				self.fetchAdminInvitations(function(adminInvitations) {

					// merge notifications
					//
					var notifications = new Backbone.Collection();
					notifications.add(projectInvitations.models);
					notifications.add(adminInvitations.models);

					// return notifications
					//
					done(notifications);
				});
			});
		},

		fetchAdminNotifications: function(done) {
			var self = this;

			// fetch pending project invitations
			//
			this.fetchProjectInvitations(function(projectInvitations) {

				// fetch pending admin invitations
				//
				self.fetchAdminInvitations(function(adminInvitations) {

					// fetch pending user permissions
					//
					self.fetchPendingUserPermissions(function(userPermissions) {

						// merge notifications
						//
						var notifications = new Backbone.Collection();
						notifications.add(projectInvitations.models);
						notifications.add(adminInvitations.models);
						notifications.add(userPermissions.models);

						// return notifications
						//
						done(notifications);
					});
				});
			});
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: this.options.title,
				message: this.options.message
			});
		},

		onRender: function() {
			var self = this;
			if (Registry.application.session.user.isAdmin()) {

				// fetch and show admin notifications
				//
				this.fetchAdminNotifications(function(notifications) {
					self.showNotifications(notifications);
				});
			} else {

				// fetch and show user notifications
				//
				this.fetchUserNotifications(function(notifications) {
					self.showNotifications(notifications);
				});
			}
		},

		showNotifications: function(notifications) {
			this.notifications.show(
				new NotificationsListView({
					collection: notifications,
					showNumbering: Registry.application.options.showNumbering
				})
			)
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// dismiss modal dialog
			//
			Registry.application.modal.hide();

			// perform callback
			//
			if (this.options.accept) {
				this.options.accept();
			}
		}
	});
});
