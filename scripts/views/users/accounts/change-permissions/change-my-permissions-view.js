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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'config',
	'registry',
	'models/permissions/policy',
	'models/permissions/user-permission',
	'collections/permissions/user-permissions',
	'text!templates/users/accounts/change-permissions/change-my-permissions.tpl',
	'views/users/info/permissions/select-permissions-list/select-permissions-list-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/users/dialogs/permission-comment-view'
], function($, _, Backbone, Marionette, Config, Registry, Policy, UserPermission, UserPermissions, Template, SelectPermissionsListView, NotifyView, ErrorView, PermissionCommentView) {
	return Backbone.Marionette.LayoutView.extend({


		//
		// methods
		//

		initialize: function() {
			this.model = Registry.application.session.user;
			this.collection = new UserPermissions();
		},

		showPermissionDialog: function(permission) {
			var self = this;

			// show permission comment dialog
			//
			Registry.application.modal.show(
				new PermissionCommentView({
					permission: permission,
					message: '<p>Please review and accept the following policy statement and provide a comment explaining why you require this permission:</p>',

					// callbacks
					//
					accept: function(data) {
						self.model.requestPermission({
							data: _.extend(data, {
								'permission_code': permission.get('permission_code'),
								'title': permission.get('title'),
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
					size: 'large'
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

		setPermission: function(permission) {
			var self = this;

			// show permission comment dialog
			//
			Registry.application.modal.show(
				new PermissionCommentView({
					parent: this.options.parent,
					permission: permission,
					changeUserPermissions: true,
					title: permission.get('title'),
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
