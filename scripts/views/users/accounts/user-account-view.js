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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
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
	'views/dialogs/error-view',
	'views/users/user-profile/user-profile-view',
	'views/users/permissions/change/change-user-permissions-view',
	'views/users/linked-accounts/change/change-user-linked-accounts-view'
], function($, _, Backbone, Marionette, Template, Config, Registry, ConfirmView, NotifyView, ErrorView, UserProfileView, ChangeUserPermissionsView, ChangeUserLinkedAccountsView) {
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
				case 'password':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#password').addClass('active');
					break;
				case 'permissions':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#permissions').addClass('active');
					break;
				case 'accounts':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#accounts').addClass('active');
					break;
				default:
				case 'edit':
				case 'profile':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#profile').addClass('active');
					break;
			}

			// display subviews
			//
			switch (this.options.nav) {
				case 'password':
					this.userProfile.show(
						new ChangeUserPasswordView({
							model: this.model,
							parent: this
						})
					);
					break;
				case 'permissions':
					this.userProfile.show(
						new ChangeUserPermissionsView({
							model: this.model,
							parent: this
						})
					);
					break;
				case 'accounts':
					this.userProfile.show(
						new ChangeUserLinkedAccountsView({
							model: this.model,
							parent: this
						})
					);
					break;
				case 'profile':
					this.userProfile.show(
						new UserProfileView({
							model: this.model,
							parent: this
						})
					);
					break;
			}
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
