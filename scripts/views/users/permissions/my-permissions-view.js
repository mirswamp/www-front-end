/******************************************************************************\
|                                                                              |
|                             my-permissions-view.js                           |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/permissions/my-permissions.tpl',
	'models/permissions/policy',
	'models/permissions/user-permission',
	'collections/permissions/user-permissions',
	'views/base-view',
	'views/users/permissions/select-list/select-permissions-list-view',
	'views/tools/permissions/dialogs/tool-permission-dialog-view',
	'views/users/permissions/dialogs/permission-comment-dialog-view'
], function($, _, Template, Policy, UserPermission, UserPermissions, BaseView, SelectPermissionsListView, ToolPermissionDialogView, PermissionCommentDialogView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#select-permissions-list'
		},

		//
		// constuctor
		//

		initialize: function() {
			this.model = application.session.user;
			this.collection = new UserPermissions();
		},

		//
		// methods
		//

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
			application.show(new ToolPermissionDialogView({
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
			});
		},

		showPermissionCommentDialog: function(permission, options) {
			var self = this;

			// show permission comment dialog
			//
			application.show(new PermissionCommentDialogView({
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
						success: function(model) {

							// show success notification message
							//
							if (!permission.isAutoApprove()) {
								application.notify({
									title: "Permission Requested",
									message: "Your permission has been requested.  The SWAMP staff will review your requests and respond to you shortly.",

									// callbacks
									//
									accept: function() {
										self.options.parent.render();
									}
								});
							} else {

								// update status fields
								//
								self.showPermissionsList();
							}
						},

						error: function(response) {

							// show error message
							//
							application.error({
								message: "Error: " + response.responseText
							});
						}
					});
				}
			}), {
				size: permission.has('policy')? 'large' : undefined
			});
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
						});
						self.showPermissionDialog(permission);
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch policy: " + policy.get('policy_code')
						});
					}
				});
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
			application.show(new PermissionCommentDialogView({
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

							// show error message
							//
							application.error({
								message: "Could not save permissions changes: " + response.responseText
							});
						}
					});
				}
			}), {
				size: permission.has('policy')? 'large' : undefined
			});
		},

		//
		// rendering methods
		//

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
					self.showChildView('list', new SelectPermissionsListView({
						model: self.model,
						collection: self.collection,
						parent: self
					}));
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get permissions for this user."
					});
				}
			});
		}
	});
});
