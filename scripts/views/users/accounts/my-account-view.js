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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/accounts/my-account.tpl',
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
			'click #edit': 'onClickEdit',
			'click #change-password': 'onClickChangePassword',
			'click #reset-password': 'onClickResetPassword',
			'click #delete-account': 'onClickDeleteAccount'
		},

		//
		// constructor
		//

		initialize: function() {

			// set model to current user
			//
			this.model = application.session.user;
		},

		//
		// rendering methods
		//

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
				case 'events':
					this.showMyEvents();
					break;
				default:
					this.showMyProfile();
					break;
			}
		},

		showMyProfile: function() {
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

		showEditMyAccount: function() {
			var self = this;
			require([
				'views/users/accounts/edit/edit-my-account-view'
			], function (EditMyAccountView) {
				self.showChildView('profile', new EditMyAccountView({
					model: self.model,
					parent: self
				}));
			});
		},

		showMyPermissions: function() {
			var self = this;
			require([
				'views/users/accounts/permissions/my-permissions-view'
			], function (MyPermissionsView) {
				self.showChildView('profile', new MyPermissionsView({
					model: self.model,
					parent: self
				}));
			});
		},

		showMyLinkedAccounts: function() {
			var self = this;
			require([
				'views/users/accounts/linked-accounts/my-linked-accounts-view',
			], function (MyLinkedAccountsView) {
				self.showChildView('profile', new MyLinkedAccountsView({
					model: self.model,
					parent: self
				}));
			});
		},

		showMyPasswords: function() {
			var self = this;
			require([
				'views/users/accounts/passwords/my-passwords-view',
			], function (MyPasswordsView) {
				self.showChildView('profile', new MyPasswordsView({
					model: self.model,
					parent: self
				}));
			});
		},

		showMyClasses: function() {
			var self = this;
			require([
				'views/users/accounts/classes/my-classes-view',
			], function (MyClassesView) {
				self.showChildView('profile', new MyClassesView({
					model: self.model,
					parent: self
				}));
			});
		},

		showMyEvents: function() {
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
		// utility methods
		//

		deleteAccount: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
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
							application.session.logout({

								// callbacks
								//
								success: function(){

									// go to welcome view
									//
									application.navigate('#');
								},
								
								error: function(jqxhr, textstatus, errorThrown) {

									// show error message
									//
									application.error({
										message: "Could not log out: " + errorThrown + "."
									});
								}
							});
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete your user account."
							});
						}
					});
				}
			});
		},

		//
		// event handling methods
		//

		onClickProfile: function() {
			application.navigate('#my-account');
		},

		onClickPermissions: function() {
			application.navigate('#my-account/permissions');
		},

		onClickAccounts: function() {
			application.navigate('#my-account/accounts');
		},

		onClickPasswords: function() {
			application.navigate('#my-account/passwords');
		},

		onClickClasses: function() {
			application.navigate('#my-account/classes');
		},

		onClickEvents: function() {
			application.navigate('#my-account/events');
		},

		onClickEdit: function() {
			application.navigate('#my-account/edit');
		},

		onClickChangePassword: function() {
			require([
				'views/users/accounts/dialogs/change-password/change-my-password-dialog-view'
			], function (ChangeMyPasswordDialogView) {

				// show change my password dialog
				//
				application.show(new ChangeMyPasswordDialogView({
					parent: this
				}));
			});
		},

		onClickResetPassword: function() {
			require([
				'views/users/authentication/reset-password/dialogs/reset-password-dialog-view'
			], function (ResetPasswordDialogView) {

				// show reset password dialog
				//
				application.show(new ResetPasswordDialogView({
					user: application.session.user,
					parent: this
				}));
			});
		},

		onClickDeleteAccount: function() {
			this.deleteAccount();
		}
	});
});
