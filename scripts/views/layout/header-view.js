/******************************************************************************\
|                                                                              |
|                                 header-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application header and associated content.           |
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
	'text!templates/layout/header.tpl',
	'config',
	'registry',
	'collections/projects/project-invitations',
	'collections/admin/admin-invitations',
	'collections/permissions/user-permissions'
], function($, _, Backbone, Marionette, Template, Config, Registry, ProjectInvitations, AdminInvitations, UserPermissions) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #brand': 'onClickBrand',
			'click #about': 'onClickAbout',
			'click #contact': 'onClickContact',
			'click #resources': 'onClickResources',
			'click #policies': 'onClickPolicies',
			'click #help': 'onClickHelp',
			'click #my-account': 'onClickMyAccount',
			'click #notifications-alert': 'onClickNotifications',
			'click #sign-in': 'onClickSignIn',
			'click #sign-out': 'onClickSignOut',
		},

		//
		// ajax methods
		//

		fetchNumNotifications: function(done) {

			// fetch number of project invitations
			//
			ProjectInvitations.fetchNumPendingByUser(Registry.application.session.user, {
				
				// callback
				//
				success: function(numProjectInvitations) {
					numProjectInvitations = parseInt(numProjectInvitations);

					// fetch number of admin invitations
					//
					AdminInvitations.fetchNumPendingByUser(Registry.application.session.user, {
						
						// callback
						//
						success: function(numAdminInvitations) {
							numAdminInvitations = parseInt(numAdminInvitations);

							if (Registry.application.session.user.isAdmin()) {

								// fetch number of pending permissions
								//
								UserPermissions.fetchNumPending({

									// callback
									//
									success: function(numPendingPermissions) {
										numPendingPermissions = parseInt(numPendingPermissions);

										// return sum of notifications
										//
										done(numProjectInvitations + numAdminInvitations + numPendingPermissions);
									}
								});
							} else {

								// return sum of notifications
								//
								done(numProjectInvitations + numAdminInvitations);
							}
						}
					});
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				nav: this.options.nav,
				user: Registry.application.session.user,
				showContact: Config.contact != undefined
			}));
		},

		onRender: function() {
			this.showPopovers();

			// display badge with number of notifications
			//
			if (Registry.application.session.user) {
				var self = this;
				this.fetchNumNotifications(function(number) {
					if (number > 0) {
						// self.addBadge('i.fa-user', number);
						self.$el.find('#notifications-alert').show();
						self.addBadge('#notifications-alert i', number);
					}
				});
			}
		},

		onShow: function() {

			// focus sign in button
			//
			if (this.options.nav == 'home') {
				this.$el.find('#sign-in').focus();
			}		
		},

		showPopovers: function() {
			var self = this;
			require([
				'bootstrap/popover',
			], function () {

				// display popovers on hover
				//
				self.$el.find('[data-toggle="popover"]').popover({
					trigger: 'hover'
				});
			});
		},

		addBadge: function(selector, number) {
			if (number > 0) {
				var badge = this.$el.find(selector).append('<span class="badge">' + number + '</span>');
			} else {
				var badge = this.$el.find(selector).append('<span class="badge badge-important">' + number + '</span>');
			}

			badge.attr({
				'data-toggle': 'popover',
				'title': 'Notifications',
				'data-content': 'You have pending notifications.'
			})

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover',
				placement: function (context, source) {
					if ($(window).width() < 770) {
						return "right";
					} else {
						return "bottom";
					}
				},
				'container': $('body')
			});
		},

		//
		// event handling methods
		//

		onClickBrand: function() {
			if (Registry.application.session.user) {

				// if user logged in, go to home view
				//
				Backbone.history.navigate('#home', {
					trigger: true
				});
			} else {

				// go to welcome view
				//
				Backbone.history.navigate('#', {
					trigger: true
				});
			}
		},

		onClickAbout: function() {
			Backbone.history.navigate('#about', {
				trigger: true
			});
		},

		onClickContact: function() {
			Backbone.history.navigate('#contact', {
				trigger: true
			});
		},

		onClickResources: function() {
			Backbone.history.navigate('#resources', {
				trigger: true
			});
		},

		onClickPolicies: function() {
			Backbone.history.navigate('#policies', {
				trigger: true
			});
		},

		onClickHelp: function() {
			Backbone.history.navigate('#help', {
				trigger: true
			});
		},

		onClickMyAccount: function() {
			Backbone.history.navigate('#my-account', {
				trigger: true
			});
		},

		onClickSignIn: function() {
			var self = this;
			require([
				'views/users/authentication/dialogs/sign-in-view'
			], function (SignInView) {

				// show sign in dialog
				//
				Registry.application.modal.show(
					new SignInView(), {
						focus: '#ok'
					}
				);
			});
		},

		onClickNotifications: function(event) {
			event.stopPropagation();

			var self = this;
			require([
				'views/notifications/dialogs/notifications-view'
			], function (NotificationsView) {

				// show notifications dialog
				//
				Registry.application.modal.show(
					new NotificationsView()
				)
			});
		},

		onClickSignOut: function() {
			Registry.application.logout();
		}
	});
});
