/******************************************************************************\
|                                                                              |
|                          change-user-permissions-view.js                     |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'models/permissions/user-permission',
	'collections/permissions/user-permissions',
	'text!templates/users/accounts/change-permissions/change-user-permissions.tpl',
	'registry',
	'config',
	'views/users/info/permissions/select-permissions-list/select-permissions-list-view',
	'views/dialogs/error-view',
	'views/users/dialogs/permission-comment-view'
], function($, _, Backbone, Marionette, UserPermission, UserPermissions, Template, Registry, Config, SelectPermissionsListView, ErrorView, PermissionCommentView) {
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
			Registry.application.modal.show(
				new PermissionCommentView({
					parent: this.options.parent,
					changeUserPermissions: true,
					title: permission.get('title'),
					permission: permission,
					message: '<p>Please review and comment on this request:</p>',
					policy: '',

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
					size: 'large'
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
