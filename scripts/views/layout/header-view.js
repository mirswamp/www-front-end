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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/popover',
	'text!templates/layout/header.tpl',
	'config',
	'collections/projects/project-invitations',
	'collections/admin/admin-invitations',
	'collections/permissions/user-permissions',
	'views/base-view'
], function($, _, Popover, Template, Config, ProjectInvitations, AdminInvitations, UserPermissions, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

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
			ProjectInvitations.fetchNumPendingByUser(application.session.user, {
				
				// callback
				//
				success: function(numProjectInvitations) {
					numProjectInvitations = parseInt(numProjectInvitations);

					// fetch number of admin invitations
					//
					AdminInvitations.fetchNumPendingByUser(application.session.user, {
						
						// callback
						//
						success: function(numAdminInvitations) {
							numAdminInvitations = parseInt(numAdminInvitations);

							if (application.session.user.isAdmin()) {

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

		templateContext: function() {
			return {
				nav: this.options.nav,
				user: application.session.user,
				show_contact: Config.contact != undefined,
				show_resources: Config.resources != undefined,
				show_policies: Config.policies != undefined,
				show_help: Config.help != undefined
			};
		},

		onRender: function() {
			this.showPopovers();

			// display badge with number of notifications
			//
			if (application.session.user) {
				var self = this;
				this.fetchNumNotifications(function(number) {
					if (number > 0) {
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

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		addBadge: function(selector, number) {
			var badge;

			if (number > 0) {
				badge = this.$el.find(selector).append('<span class="badge">' + number + '</span>');
			} else {
				badge = this.$el.find(selector).append('<span class="badge badge-important">' + number + '</span>');
			}

			badge.attr({
				'data-toggle': 'popover',
				'title': 'Notifications',
				'data-content': 'You have pending notifications.'
			});

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
			if (application.session.user) {

				// if user logged in, go to home view
				//
				application.navigate('#home');
			} else {

				// go to welcome view
				//
				application.navigate('#');
			}
		},

		onClickAbout: function() {
			application.navigate('#about');
		},

		onClickContact: function() {
			application.navigate('#contact');
		},

		onClickResources: function() {
			application.navigate('#resources');
		},

		onClickPolicies: function() {
			application.navigate('#policies');
		},

		onClickHelp: function() {
			application.navigate('#help');
		},

		onClickMyAccount: function() {
			application.navigate('#my-account');
		},

		onClickSignIn: function() {
			application.showSignInDialog();
		},

		onClickNotifications: function(event) {

			// prevent further handling of event
			//
			event.stopPropagation();
			event.preventDefault();

			var self = this;
			require([
				'views/notifications/dialogs/notifications-dialog-view'
			], function (NotificationsDialogView) {

				// show notifications dialog
				//
				application.show(new NotificationsDialogView());
			});
		},

		onClickSignOut: function() {
			application.logout();
		}
	});
});
