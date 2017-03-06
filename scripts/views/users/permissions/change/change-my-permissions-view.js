/******************************************************************************\
|                                                                              |
|                          change-my-permissions-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|           This defines a view for changing the user's permissions.           |
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
	'config',
	'registry',
	'text!templates/users/permissions/change/change-my-permissions.tpl',
	'models/permissions/policy',
	'models/permissions/user-permission',
	'collections/permissions/user-permissions',
	'views/users/permissions/select-list/select-permissions-list-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/tools/permissions/dialogs/tool-permission-view',
	'views/users/permissions/dialogs/permission-comment-view'
], function($, _, Backbone, Marionette, Config, Registry, Template, Policy, UserPermission, UserPermissions, SelectPermissionsListView, NotifyView, ErrorView, ToolPermissionView, PermissionCommentView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// methods
		//

		initialize: function() {
			this.model = Registry.application.session.user;
			this.collection = new UserPermissions();
		},

		showPermissionDialog: function(permission) {
			var permissionCode = permission.get('permission_code');
			if (UserPermission.restrictedPermissions.contains(permissionCode)) {

				// show permission form dialog
				//
				this.showPermissionFormDialog(permission);			
			} else {

				// show permission comment dialog
				//
				this.showPermissionCommentDialog(permission);
			}
		},

		showPermissionFormDialog: function(permission) {
			var self = this;

			// show permission form dialog
			//
			Registry.application.modal.show(
				new ToolPermissionView({
					permission: permission,
					
					// callbacks
					//
					accept: function(data) {
						self.showPermissionCommentDialog(permission, {
							data: data
						});
					}
				}), {
					size: permission.has('policy')? 'large' : undefined
				}
			);
		},

		showPermissionCommentDialog: function(permission, options) {
			var self = this;

			// show permission comment dialog
			//
			Registry.application.modal.show(
				new PermissionCommentView({
					permission: permission,

					// callbacks
					//
					accept: function(data) {

						// perform permission request
						//
						self.model.requestPermission({
							data: _.extend(options && options.data? options.data : {}, {
								'title': permission.get('title'),
								'permission_code': permission.get('permission_code'),
								'comment': data.comment,
								'status': permission.get('status')
							}),

							// callbacks
							//
							success: function() {

								// show success notification dialog
								//
								Registry.application.modal.show(
									new NotifyView({
										title: "Permission Requested",
										message: "Your permission has been requested.  The SWAMP staff will review your requests and respond to you shortly.",

										// callbacks
										//
										accept: function() {
											self.options.parent.render();
										}
									})
								);
							},

							error: function(response) {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Error: " + response.responseText
									})
								);
							}
						});
					}
				}), {
					size: permission.has('policy')? 'large' : undefined
				}
			);
		},

		requestPermission: function(permission) {
			var self = this;

			// fetch policy
			//
			if (permission.has('policy_code')) {
				var policy = new Policy({
					'policy_code': permission.get('policy_code')
				});
				policy.fetch({

					// callbacks
					//
					success: function() {
						permission.set({
							'policy': policy.get('policy')
						})
						self.showPermissionDialog(permission);
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch policy: " + policy.get('policy_code')
							})
						);
					}
				})
			} else {
				self.showPermissionDialog(permission);
			}
		},

		renewPermission: function(permission) {
			this.showPermissionCommentDialog(permission);
		},

		setPermission: function(permission) {
			var self = this;

			// show permission comment dialog
			//
			Registry.application.modal.show(
				new PermissionCommentView({
					model: this.model,
					permission: permission,
					changeUserPermissions: false,
					parent: this.options.parent,
					
					// callbacks
					//
					accept: function(data) {
						self.model.setPermission({
							data: _.extend(data, {
								'permission_code': permission.get('permission_code'),
								'title': permission.get('title'),
								'status': permission.get('status')
							}),

							// callbacks
							//
							success: function() {

								// update parent view
								//
								self.options.parent.render();
							},

							error: function(response) {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not save permissions changes: " + response.responseText
									})
								);
							}
						});
					}
				}), {
					size: permission.has('policy')? 'large' : undefined
				}
			);
		},

		//
		// rendering methods
		//

		template: function(){
			return _.template(Template);
		},

		onRender: function() {

			// show list subview
			//
			this.showPermissionsList();
		},

		showPermissionsList: function() {
			var self = this;

			// fetch list of permissions for a user
			//
			this.collection.fetchByUser(self.model, {

				// callbacks
				//
				success: function() {

					// show select permissions list view
					//
					self.selectPermissionsList = new SelectPermissionsListView({
						el: self.$el.find('#select-permissions-list'),
						model: self.model,
						collection: self.collection,
						parent: self
					});
					self.selectPermissionsList.render();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get permissions for this user."
						})
					);
				}
			});
		}
	});
});
