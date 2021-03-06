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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/accounts/user-account.tpl',
	'views/base-view',
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#user-profile'
		},

		events: {
			'click #profile': 'onClickProfile',
			'click #permissions': 'onClickPermissions',
			'click #accounts': 'onClickAccounts',
			'click #passwords': 'onClickPasswords',
			'click #classes': 'onClickClasses',
			'click #events': 'onClickEvents',
			"click #edit": "onClickEdit",
			'click #change-password': 'onClickChangePassword',
			'click #reset-password': 'onClickResetPassword',
			'click #delete-account': 'onClickDeleteAccount'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				name: this.model.getFullName()
			};
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
				case 'events':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#events').addClass('active');
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
				case 'classes':
					this.showUserClasses();
					break;
				case 'events':
					this.showUserEvents();
					break;
				default:
					this.showUserProfile();
					break;
			}
		},

		showUserProfile: function() {
			var self = this;
			require([
				'views/users/accounts/user-profile/user-profile-view'
			], function (UserProfileView) {
				self.showChildView('profile', new UserProfileView({
					model: self.model,
					parent: self
				}));
			});
		},

		showEditUserAccount: function() {
			var self = this;
			require([
				'views/users/accounts/edit/edit-user-account-view'
			], function (EditUserAccountView) {
				self.showChildView('profile', new EditUserAccountView({
					model: self.model,
					parent: self
				}));
			});
		},

		showUserPermissions: function() {
			var self = this;
			require([
				'views/users/accounts/permissions/user-permissions-view'
			], function (UserPermissionsView) {
				self.showChildView('profile', new UserPermissionsView({
					model: self.model,
					parent: self
				}));
			});
		},

		showUserLinkedAccounts: function() {
			var self = this;
			require([
				'views/users/accounts/linked-accounts/user-linked-accounts-view',
			], function (UserLinkedAccountsView) {
				self.showChildView('profile', new UserLinkedAccountsView({
					model: self.model,
					parent: self
				}));
			});
		},

		showUserPasswords: function() {
			var self = this;
			require([
				'views/users/accounts/passwords/user-passwords-view',
			], function (UserPasswordsView) {
				self.showChildView('profile', new UserPasswordsView({
					model: self.model,
					parent: self
				}));
			});
		},

		showUserClasses: function() {
			var self = this;
			require([
				'views/users/accounts/classes/user-classes-view',
			], function (UserClassesView) {
				self.showChildView('profile', new UserClassesView({
					model: self.model,
					parent: self
				}));
			});
		},

		showUserEvents: function() {
			var self = this;
			require([
				'views/users/accounts/events/user-events-view',
			], function (UserEventsView) {
				self.showChildView('profile', new UserEventsView({
					model: self.model,
					data: self.options.data,
					parent: self
				}));
			});
		},

		//
		// event handling methods
		//
		
		onClickProfile: function() {
			application.navigate('#accounts/' + this.model.get('user_uid'));
		},

		onClickPermissions: function() {
			application.navigate('#accounts/' + this.model.get('user_uid') + '/permissions');
		},

		onClickAccounts: function() {
			application.navigate('#accounts/' + this.model.get('user_uid') + '/accounts');
		},

		onClickPasswords: function() {
			application.navigate('#accounts/' + this.model.get('user_uid') + '/passwords');
		},

		onClickClasses: function() {
			application.navigate('#accounts/' + this.model.get('user_uid') + '/classes');
		},

		onClickEvents: function() {
			application.navigate('#accounts/' + this.model.get('user_uid') + '/events');
		},

		onClickEdit: function() {
			application.navigate('#accounts/' + this.model.get('user_uid') + '/edit');
		},

		onClickChangePassword: function() {
			var self = this;
			require([
				'views/users/accounts/dialogs/change-password/change-user-password-dialog-view'
			], function (ChangeUserPasswordDialogView) {

				// show change user password dialog
				//
				application.show(new ChangeUserPasswordDialogView({
					model: self.model,
					parent: this
				}));
			});
		},

		onClickResetPassword: function() {
			var self = this;
			require([
				'views/users/authentication/reset-password/dialogs/reset-password-dialog-view'
			], function (ResetPasswordDialogView) {

				// show reset password dialog
				//
				application.show(new ResetPasswordDialogView({
					user: self.model,
					parent: self
				}));
			});
		},

		onClickDeleteAccount: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
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

							// show success notify message
							//
							application.notify({
								title: "User Account Deleted",
								message: "This user account has been successfuly deleted.",

								// callbacks
								//
								accept: function() {

									// return to review accounts view
									//
									application.navigate('#accounts/review');
								}
							});
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this user account."
							});
						}
					});
				}
			});
		},

		onClickCancel: function() {
			application.navigate('#accounts/review');
		}
	});
});
