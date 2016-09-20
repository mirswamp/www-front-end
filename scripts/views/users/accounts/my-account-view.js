/******************************************************************************\
|                                                                              |
|                                  my-account-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing the user's account information.       |
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
	'text!templates/users/accounts/my-account.tpl',
	'config',
	'registry',
	'collections/projects/project-memberships',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/users/user-profile/user-profile-view',
	'views/users/accounts/change-permissions/change-my-permissions-view',
	'views/users/accounts/change-linked-accounts/change-my-linked-accounts-view',
	'views/users/accounts/edit/edit-my-account-view'
], function($, _, Backbone, Marionette, Template, Config, Registry, ProjectMemberships, ConfirmView, NotifyView, ErrorView, UserProfileView, ChangeMyPermissionsView, ChangeMyLinkedAccountsView, EditMyAccountView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			userProfile: "#user-profile"
		},

		events: {
			"click #profile": "onClickProfile",
			"click #permissions": "onClickPermissions",
			"click #accounts": "onClickAccounts",
			"click #edit": "onClickEdit",
			"click #change-password": "onClickChangePassword",
			"click #reset-password": "onClickResetPassword",
			"click #delete-account": "onClickDeleteAccount"
		},

		//
		// methods
		//

		initialize: function() {

			// set model to current user
			//
			this.model = Registry.application.session.user;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				config: Registry.application.config
			}));
		},

		onRender: function() {

			// update top navigation
			//
			switch (this.options.nav) {
				case "permissions":
					this.$el.find(".nav li").removeClass("active");
					this.$el.find(".nav li#permissions").addClass("active");
					break;
				case "accounts":
					this.$el.find(".nav li").removeClass("active");
					this.$el.find(".nav li#accounts").addClass("active");
					break;
				default:
				case "edit":
				case "profile":
					this.$el.find(".nav li").removeClass("active");
					this.$el.find(".nav li#profile").addClass("active");
					break;
			}

			// display subviews
			//
			switch (this.options.nav) {
				case "permissions":
					var changeMyPermissionsView = new ChangeMyPermissionsView({
						el: this.$el.find("#user-profile"),
						model: this.model,
						parent: this
					});
					changeMyPermissionsView.render();
					break;
				case "accounts":
					var changeMyLinkedAccountsView = new ChangeMyLinkedAccountsView({
						el: this.$el.find("#user-profile"),
						model: this.model,
						parent: this
					});
					changeMyLinkedAccountsView.render();
					break;
				case "edit":
					var editMyAccountView = new EditMyAccountView({
						el: this.$el.find("#user-profile"),
						model: this.model,
						parent: this
					});
					editMyAccountView.render();
					break;
				default:
				case "profile":
					var userProfileView = new UserProfileView({
						el: this.$el.find("#user-profile"),
						model: this.model,
						parent: this
					});
					userProfileView.render();
					break;
			}
		},

		//
		// utility methods
		//

		deleteAccount: function() {
			var self = this;

			// confirm delete
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete My Account",
					message: "Are you sure that you would like to delete your user account? " +
						"When you delete an account, all of the user data will continue to be retained.",

					// callbacks
					//
					accept: function() {

						// delete user
						//
						self.model.destroy({

							// callbacks
							//
							success: function() {

								// show success notification dialog
								//
								Registry.application.modal.show(
									new NotifyView({
										title: "My Account Deleted",
										message: "Your user account has been successfuly deleted.",

										// callbacks
										//
										accept: function() {

											// end session
											//
											Registry.application.session.logout({

												// callbacks
												//
												success: function(){

													// go to welcome view
													//
													Backbone.history.navigate("#", {
														trigger: true
													});
												},
												
												error: function(jqxhr, textstatus, errorThrown) {

													// show error dialog
													//
													Registry.application.modal.show(
														new ErrorView({
															message: "Could not log out: " + errorThrown + "."
														})
													);
												}
											});
										}
									})
								);
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete your user account."
									})
								);
							}
						});
					}
				})
			);
		},

		//
		// event handling methods
		//

		onClickProfile: function() {
			Backbone.history.navigate("#my-account", {
				trigger: true
			});
		},

		onClickPermissions: function() {
			Backbone.history.navigate("#my-account/permissions", {
				trigger: true
			});
		},

		onClickAccounts: function() {
			Backbone.history.navigate("#my-account/accounts", {
				trigger: true
			});
		},

		onClickEdit: function() {
			Backbone.history.navigate("#my-account/edit", {
				trigger: true
			});
		},

		onClickChangePassword: function() {
			require([
				'views/users/accounts/dialogs/change-password/change-my-password-view'
			], function (ChangeMyPasswordView) {

				// show change my password view
				//
				Registry.application.modal.show(
					new ChangeMyPasswordView({
						parent: this
					})
				);
			});
		},

		onClickResetPassword: function() {
			require([
				'views/users/authentication/dialogs/reset-password-view'
			], function (ResetPasswordView) {

				// show reset password view
				//
				Registry.application.modal.show(
					new ResetPasswordView({
						user: Registry.application.session.user,
						parent: this
					})
				);
			});
		},

		onClickDeleteAccount: function() {
			this.deleteAccount();
		}
	});
});
