/******************************************************************************\
|                                                                              |
|                             user-permissions-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for changing the user's permissions.              |
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
	'text!templates/users/permissions/user-permissions.tpl',
	'models/permissions/policy',
	'models/permissions/user-permission',
	'collections/permissions/user-permissions',
	'registry',
	'config',
	'views/users/permissions/select-list/select-permissions-list-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/tools/permissions/dialogs/tool-permission-view',
	'views/users/permissions/dialogs/permission-comment-view'
], function($, _, Backbone, Marionette, Template, Policy, UserPermission, UserPermissions, Registry, Config, SelectPermissionsListView, NotifyView, ErrorView, ToolPermissionView, PermissionCommentView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			selectPermissionsList: '#select-permissions-list'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new UserPermissions();
		},

		showPermissionDialog: function(permission) {
			var permissionCode = permission.get('permission_code');
			if (permission.has('user_info')) {

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
					model: permission,
					
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

								// update list
								//
								self.showPermissionsList();
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

		changePermissions: function(currentPermissions, newPermissions) {

			// change current user's permissions
			//
			this.model.changePermissions(currentPermissions, newPermissions, {

				// callbacks
				//
				success: function() {

					// return to user account permissions view
					//
					Backbone.history.navigate('#accounts/' + this.model.get('user_uid') + '/permissions', {
						trigger: true
					});
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
		},

		setPermission: function(permission) {
			var self = this;

			// show permission comment dialog
			//
			Registry.application.modal.show(
				new PermissionCommentView({
					model: this.model,
					permission: permission,
					changeUserPermissions: true,
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
					size: permission.has('policy') || permission.has('meta_information')? 'large' : undefined
				}
			);
		},

		//
		// rendering methods
		//

		template: function(){
			return _.template(Template, {
				user: this.model,
				parent: this
			});
		},
		
		onRender: function() {
			var self = this;

			// show list subview
			//
			this.showPermissionsList();
		},

		showPermissionsList: function() {
			var self = this;

			// fetch collection of permissions for a user
			//
			this.collection.fetchByUser(self.model, {

				// callbacks
				//
				success: function() {

					// show select permissions list view
					//
					self.selectPermissionsList.show(
						new SelectPermissionsListView({
							model: self.model,
							collection: self.collection,
							parent: self
						})
					);
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
