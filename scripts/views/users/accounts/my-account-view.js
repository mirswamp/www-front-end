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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/accounts/my-account.tpl',
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
			'click #classes': 'onClickClasses',
			'click #edit': 'onClickEdit',
			'click #change-password': 'onClickChangePassword',
			'click #reset-password': 'onClickResetPassword',
			'click #delete-account': 'onClickDeleteAccount'
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
				case 'classes':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#classes').addClass('active');
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
					this.showMyProfile();
					break;
				case 'edit':
					this.showEditMyProfile();
					break;
				case 'permissions':
					this.showMyPermissions();
					break;
				case 'accounts':
					this.showMyLinkedAccounts();
					break;
				case 'passwords':
					this.showMyPasswords();
					break;
				case 'classes':
					this.showMyClasses();
					break;
				default:
					this.showMyProfile();
					break;
			}
		},

		showMyProfile: function() {
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

		showEditMyAccount: function() {
			var self = this;
			require([
				'views/users/accounts/edit/edit-my-account-view'
			], function (EditMyAccountView) {
				self.userProfile.show(
					new EditMyAccountView({
						model: self.model,
						parent: self
					})
				);
			});
		},

		showMyPermissions: function() {
			var self = this;
			require([
				'views/users/permissions/my-permissions-view'
			], function (MyPermissionsView) {
				self.userProfile.show(
					new MyPermissionsView({
						model: self.model,
						parent: self
					})
				);
			});
		},

		showMyLinkedAccounts: function() {
			var self = this;
			require([
				'views/users/linked-accounts/my-linked-accounts-view',
			], function (MyLinkedAccountsView) {
				self.userProfile.show(
					new MyLinkedAccountsView({
						model: self.model,
						parent: self
					})
				);
			});
		},

		showMyPasswords: function() {
			var self = this;
			require([
				'views/users/passwords/my-passwords-view',
			], function (MyPasswordsView) {
				self.userProfile.show(
					new MyPasswordsView({
						model: self.model,
						parent: self
					})
				);
			});
		},

		showMyClasses: function() {
			var self = this;
			require([
				'views/users/classes/my-classes-view',
			], function (MyClassesView) {
				self.userProfile.show(
					new MyClassesView({
						model: self.model,
						parent: self
					})
				);
			});
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
								
								// end session
								//
								Registry.application.session.logout({

									// callbacks
									//
									success: function(){

										// go to welcome view
										//
										Backbone.history.navigate('#', {
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
			Backbone.history.navigate('#my-account', {
				trigger: true
			});
		},

		onClickPermissions: function() {
			Backbone.history.navigate('#my-account/permissions', {
				trigger: true
			});
		},

		onClickAccounts: function() {
			Backbone.history.navigate('#my-account/accounts', {
				trigger: true
			});
		},

		onClickPasswords: function() {
			Backbone.history.navigate('#my-account/passwords', {
				trigger: true
			});
		},

		onClickClasses: function() {
			Backbone.history.navigate('#my-account/classes', {
				trigger: true
			});
		},

		onClickEdit: function() {
			Backbone.history.navigate('#my-account/edit', {
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
