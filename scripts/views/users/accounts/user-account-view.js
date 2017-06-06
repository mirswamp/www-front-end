/******************************************************************************\
|                                                                              |
|                                 user-account-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's account information.         |
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
	'text!templates/users/accounts/user-account.tpl',
	'config',
	'registry',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Template, Config, Registry, ConfirmView, NotifyView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			userProfile: '#user-profile'
		},

		events: {
			'click #profile': 'onClickProfile',
			'click #permissions': 'onClickPermissions',
			'click #accounts': 'onClickAccounts',
			'click #passwords': 'onClickPasswords',
			"click #edit": "onClickEdit",
			'click #change-password': 'onClickChangePassword',
			'click #reset-password': 'onClickResetPassword',
			'click #delete-account': 'onClickDeleteAccount'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				config: Registry.application.config
			}));
		},

		onRender: function() {

			// update top navigation
			//
			switch (this.options.nav) {
				case 'profile':
				case 'edit':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#profile').addClass('active');
					break;
				case 'permissions':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#permissions').addClass('active');
					break;
				case 'accounts':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#accounts').addClass('active');
					break;
				case 'passwords':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#passwords').addClass('active');
					break;
				default:
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#profile').addClass('active');
					break;
			}

			// display subviews
			//
			switch (this.options.nav) {
				case 'profile':
					this.showUserProfile();
					break;
				case 'edit':
					this.showEditUserProfile();
					break;
				case 'permissions':
					this.showUserPermissions();
					break;
				case 'accounts':
					this.showUserLinkedAccounts();
					break;
				case 'passwords':
					this.showUserPasswords();
					break;
				default:
					this.showUserProfile();
					break;
			}
		},

		showUserProfile: function() {
			var self = this;
			require([
				'views/users/user-profile/user-profile-view'
			], function (UserProfileView) {
				self.userProfile.show(
					new UserProfileView({
						model: self.model,
						parent: self
					})
				);
			});
		},

		showEditUserAccount: function() {
			var self = this;
			require([
				'views/users/accounts/edit/edit-user-account-view'
			], function (EditUserAccountView) {
				self.userProfile.show(
					new EditUserAccountView({
						model: self.model,
						parent: self
					})
				);
			});
		},

		showUserPermissions: function() {
			var self = this;
			require([
				'views/users/permissions/user-permissions-view'
			], function (UserPermissionsView) {
				self.userProfile.show(
					new UserPermissionsView({
						model: self.model,
						parent: self
					})
				);
			});
		},

		showUserLinkedAccounts: function() {
			var self = this;
			require([
				'views/users/linked-accounts/user-linked-accounts-view',
			], function (UserLinkedAccountsView) {
				self.userProfile.show(
					new UserLinkedAccountsView({
						model: self.model,
						parent: self
					})
				);
			});
		},

		showUserPasswords: function() {
			var self = this;
			require([
				'views/users/passwords/user-passwords-view',
			], function (UserPasswordsView) {
				self.userProfile.show(
					new UserPasswordsView({
						model: self.model,
						parent: self
					})
				);
			});
		},

		//
		// event handling methods
		//
		
		onClickProfile: function() {
			Backbone.history.navigate('#accounts/' + this.model.get('user_uid'), {
				trigger: true
			});
		},

		onClickPermissions: function() {
			Backbone.history.navigate('#accounts/' + this.model.get('user_uid') + '/permissions', {
				trigger: true
			});
		},

		onClickAccounts: function() {
			Backbone.history.navigate('#accounts/' + this.model.get('user_uid') + '/accounts', {
				trigger: true
			});
		},

		onClickPasswords: function() {
			Backbone.history.navigate('#accounts/' + this.model.get('user_uid') + '/passwords', {
				trigger: true
			});
		},

		onClickEdit: function() {
			Backbone.history.navigate('#accounts/' + this.model.get('user_uid') + '/edit', {
				trigger: true
			});
		},

		onClickChangePassword: function() {
			var self = this;
			require([
				'views/users/accounts/dialogs/change-password/change-user-password-view'
			], function (ChangeUserPasswordView) {

				// show change user password view
				//
				Registry.application.modal.show(
					new ChangeUserPasswordView({
						model: self.model,
						parent: this
					})
				);
			});
		},

		onClickResetPassword: function() {
			var self = this;
			require([
				'views/users/authentication/dialogs/reset-password-view'
			], function (ResetPasswordView) {

				// show reset password view
				//
				Registry.application.modal.show(
					new ResetPasswordView({
						user: self.model,
						parent: self
					})
				);
			});
		},

		onClickDeleteAccount: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete User Account",
					message: "Are you sure that you would like to delete " +
						this.model.getFullName() + "'s user account? " +
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
										title: "User Account Deleted",
										message: "This user account has been successfuly deleted.",

										// callbacks
										//
										accept: function() {

											// return to review accounts view
											//
											Backbone.history.navigate('#accounts/review', {
												trigger: true
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
										message: "Could not delete this user account."
									})
								);
							}
						});
					}
				})
			);
		},

		onClickCancel: function() {
			Backbone.history.navigate('#accounts/review', {
				trigger: true
			});
		}
	});
});
