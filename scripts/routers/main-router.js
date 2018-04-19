/******************************************************************************\
|                                                                              |
|                                  main-router.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for this application.        |
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
	'backbone'
], function($, _, Backbone) {

	// create router
	//
	return Backbone.Router.extend({

		//
		// route definitions
		//

		routes: {

			// main routes
			//
			'': 'showWelcome',
			'sign-in': 'showSignIn',
			'about': 'showAbout',
			'about/:anchor': 'showAbout',
			'mailing-list/subscribe': 'showMailingListSubscribe',
			'help': 'showHelp',

			// information routes
			//
			'resources': 'showResources',
			'resources/heartbit': 'showHeartbit',
			'policies': 'showPolicies',
			'policies/:policyName': 'showPolicy',

			// contact / feedback routes
			//
			'contact': 'showContactUs',
			'contact/security': 'showReportIncident',

			// user registration routes
			//
			'register': 'showRegister',
			'register/verify-email/:verification_key': 'showVerifyEmail',
		
			// email change verification
			//
			'verify-email/:verification_key': 'showVerifyEmailChange',

			// password reset routes
			//
			'reset-password/:password_reset_key/:password_reset_id': 'showResetPassword',

			// my account routes
			//
			'home': 'showHome',
			'my-account': 'showMyAccount',
			'my-account/permissions': 'showMyPermissions',
			'my-account/accounts': 'showMyLinkedAccounts',
			'my-account/passwords': 'showMyPasswords',
			'my-account/classes': 'showMyClasses',
			'my-account/edit': 'showEditMyAccount',

			// administration routes
			//
			'overview': 'showSystemOverview',
			'accounts/review(?*query_string)': 'showReviewAccounts',

			// user account routes
			//
			'accounts/:user_uid': 'showUserAccount',
			'accounts/:user_uid/permissions': 'showUserAccountPermissions',
			'accounts/:user_uid/accounts': 'showUserLinkedAccounts',
			'accounts/:user_uid/passwords': 'showUserPasswords',
			'accounts/:user_uid/classes': 'showUserClasses',
			'accounts/:user_uid/edit': 'showEditUserAccount',

			// user event routes
			//
			'events(?*query_string)': 'showEvents',

			// linked account integration routes
			//
			'linked-account/prompt': 'showLinkedAccountPrompt',
			'linked-account/login': 'showLinkedAccountLogin',
			'linked-account/error/:type': 'showLinkedAccountError',

			// system settings routes
			//
			'settings': 'showSettings',
			'settings/restricted-domains': 'showSettings',
			'settings/admins': 'showAdminSettings',
			'settings/admins/invite': 'showInviteAdmins',
			'settings/admins/invite/confirm/:invitation_key': 'showConfirmAdminInvitation',
			'settings/email': 'showEmailSettings',

			// status routes
			//
			'status/review': 'showReviewStatus',

			// no route found
			//
			'*404': 'showNotFound'
		},

		//
		// route handlers
		//

		showWelcome: function() {
			var self = this;
			require([
				'registry',
				'views/welcome-view'
			], function (Registry, WelcomeView) {
				var user = Registry.application.session.user;

				// check if user is logged in
				//
				if (user && (user.user_uid !== 'current')) {

					// go to home view
					//
					self.navigate('#home', {
						trigger: true
					});

					return;
				}

				// show welcome view
				//
				Registry.application.showPage(
					new WelcomeView()
				);
			});
		},

		showSignIn: function() {
			var self = this;
			require([
				'registry',
				'views/welcome-view'
			], function (Registry, WelcomeView) {
				var user = Registry.application.session.user;

				// check if user is logged in
				//
				if (user && (user.user_uid !== 'current')) {

					// go to home view
					//
					self.navigate('#home', {
						trigger: true
					});

					return;
				}

				// show welcome view
				//
				Registry.application.showPage(
					new WelcomeView({
						showSignIn: true
					})
				);
			});
		},

		showAbout: function(anchor) {
			require([
				'registry',
				'views/info/about-view'
			], function (Registry, AboutView) {

				// show about view
				//
				Registry.application.showMain( 
					new AboutView({
						'anchor': anchor
					}), {
						nav: 'about'
					}
				);
			});
		},

		showHelp: function() {
			require([
				'registry',
				'views/info/help-view'
			], function (Registry, HelpView) {

				// show help view
				//
				Registry.application.showMain( 
					new HelpView(), {
						nav: 'help'
					}
				);
			});
		},

		showResources: function() {
			require([
				'registry',
				'views/info/resources-view'
			], function (Registry, ResourcesView) {

				// show resources view
				//
				Registry.application.showMain( 
					new ResourcesView(), {
						nav: 'resources'
					}
				);
			});
		},

		showHeartbit: function() {
			require([
				'registry',
				'views/info/resources/heartbit-view'
			], function (Registry, HeartbitView) {

				// show heartbit view
				//
				Registry.application.showMain(
					new HeartbitView(), {
						nav: 'resources'
					}
				);
			});
		},

		showPolicies: function() {
			require([
				'registry',
				'views/info/policies-view'
			], function (Registry, PoliciesView) {
				Registry.application.showMain(
					new PoliciesView(), {
						nav: 'policies'
					}
				);
			});
		},

		showPolicy: function(policyName) {
			require([
				'registry',
				'views/policies/policy-view',
			], function (Registry, PolicyView) {
				Registry.application.showMain(
					new PolicyView({
						template_file: 'text!templates/policies/' + policyName + '.tpl'
					}), {
						nav: 'policies'
					}
				);
			});
		},

		showMailingListSubscribe: function() {
			require([
				'registry',
				'views/info/mailing-list/subscribe-view'
			], function (Registry, SubscribeView) {

				// show subscribe view
				//
				Registry.application.showMain(
					new SubscribeView(), {
						nav: 'about'
					}
				);
			});
		},

		//
		// contact / feedback route handlers
		//

		showContactUs: function() {
			require([
				'registry',
				'views/contacts/contact-us-view'
			], function (Registry, ContactUsView) {

				// show contact us view
				//
				Registry.application.showMain(
					new ContactUsView(), {
						nav: 'contact'
					}
				);
			});
		},

		showReportIncident: function() {
			require([
				'registry',
				'views/contacts/report-incident-view'
			], function (Registry, ReportIncidentView) {

				// show report incident view
				//
				Registry.application.showMain(
					new ReportIncidentView(), {
						nav: 'contact'
					}
				);
			});
		},

		//
		// user registration route handlers
		//

		showRegister: function() {
			require([
				'registry',
				'views/users/registration/sign-aup-view'
			], function (Registry, SignAupView) {

				// show aup view
				//
				Registry.application.showMain( 
					new SignAupView()
				);
			});
		},

		showVerifyEmail: function(verificationKey) {
			require([
				'registry',
				'models/users/user',
				'models/users/email-verification',
				'views/dialogs/error-view',
				'views/users/registration/verify-email-view'
			], function (Registry, User, EmailVerification, ErrorView, VerifyEmailView) {

				// fetch email verification
				//
				var emailVerification = new EmailVerification({
					verification_key: verificationKey
				});

				emailVerification.fetch({

					// callbacks
					//
					success: function(model) {

						// show verify email view
						//
						Registry.application.showMain( 
							new VerifyEmailView({
								model: model
							})
						);
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "We could not verify this user."
							})
						);
					}
				});
			});
		},

		showVerifyEmailChange: function(verificationKey) {
			require([
				'registry',
				'models/users/user',
				'models/users/email-verification',
				'views/dialogs/notify-view',
				'views/users/registration/verify-email-changed-view'
			], function (Registry, User, EmailVerification, NotifyView, VerifyEmailChangedView) {

				// fetch email verification
				//
				var emailVerification = new EmailVerification({
					verification_key: verificationKey
				});

				emailVerification.fetch({

					// callbacks
					//
					success: function(model) {

						// show verify email changed view
						//
						Registry.application.showMain( 
							new VerifyEmailChangedView({
								model: model
							})
						);
					},

					error: function() {

						// show notify dialog
						//
						Registry.application.modal.show(
							new NotifyView({
								message: "We could not verify this user."
							})
						);
					}
				});
			});
		},

		//
		// password reset route handlers
		//

		showResetPassword: function(passwordResetUuid, passwordResetNonce) {
			require([
				'registry',
				'models/users/user',
				'models/users/password-reset',
				'views/dialogs/error-view',
				'views/users/reset-password/reset-password-view',
				'views/users/reset-password/invalid-reset-password-view'
			], function (Registry, User, PasswordReset, ErrorView, ResetPasswordView, InvalidResetPasswordView) {

				// fetch password reset
				//
				new PasswordReset({
					'password_reset_uuid': passwordResetUuid,
					'password_reset_nonce': passwordResetNonce
				}).fetch({

					// callbacks
					//
					success: function(model) {

						// show reset password view
						//
						Registry.application.showMain( 
							new ResetPasswordView({
								model: model
							})
						);
					},

					error: function(model) {

						// show invalid reset password view
						//
						Registry.application.showMain( 
							new InvalidResetPasswordView({
								model: model
							})
						);
					}
				});
			});
		},

		//
		// administration route handlers
		//

		showSystemOverview: function(options) {
			var self = this;
			require([
				'registry',
				'views/admin/overview/system-overview-view'
			], function (Registry, SystemOverviewView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'overview', 

					// callbacks
					//
					done: function(view) {

						// show admin dashboard view
						//
						view.content.show(
							new SystemOverviewView()
						);

						if (options && options.done) {
							options.done();
						}
					}
				});
			});
		},

		showOverview: function(options) {
			var self = this;
			require([
				'registry',
				'views/admin/overview/overview-view'
			], function (Registry, OverviewView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'overview', 

					// callbacks
					//
					done: function(view) {

						// show overview view
						//
						view.content.show(
							new OverviewView({
								nav: options.nav,
								data: options.data
							})
						);

						if (options && options.done) {
							options.done();
						}
					}
				});
			});
		},
		
		showReviewAccounts: function(queryString) {
			require([
				'registry',
				'routers/query-string-parser',
				'views/users/review/review-accounts-view',
			], function (Registry, QueryStringParser, ReviewAccountsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'overview', 

					// callbacks
					//
					done: function(view) {

						// show overview view
						//
						view.content.show(
							new ReviewAccountsView({
								data: QueryStringParser.parse(queryString, view.model)
							})
						);
					}
				});
			});
		}, 

		//
		// my account route handlers
		//

		showHome: function(options) {
			var self = this;
			require([
				'registry',
				'views/home-view'
			], function (Registry, HomeView) {
				var user = Registry.application.session.user;

				// redirect to main view
				//
				if (!user || ( user.user_uid === 'current' ) ) {
					self.navigate('#', {
						trigger: true
					});
					return;
				}

				// show home view
				//
				Registry.application.showPage(
					new HomeView({
						nav: options? options.nav : 'home'
					}),
					options
				);
			});
		},

		showMyAccount: function(options) {
			var self = this;
			require([
				'registry',
				'views/users/accounts/my-account-view'
			], function (Registry, MyAccountView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'my-account',
					nav2: undefined,

					// callbacks
					//
					done: function(view) {

						// show user account view
						//
						view.content.show(
							new MyAccountView({
								nav: options && options.nav? options.nav : 'profile'
							})
						);

						if (options && options.done) {
							options.done();
						}
					}
				});
			});
		},

		showEditMyAccount: function(options) {
			var self = this;
			require([
				'registry',
				'views/users/accounts/edit/edit-my-account-view'
			], function (Registry, EditMyAccountView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'my-account',
					nav2: undefined,

					// callbacks
					//
					done: function(view) {

						// show edit user account view
						//
						view.content.show(
							new EditMyAccountView()
						);

						if (options && options.done) {
							options.done();
						}
					}
				});
			});
		},

		showMyPermissions: function(options) {
			this.showMyAccount(_.extend(options || {}, {
				nav: 'permissions'
			}));
		},

		showMyLinkedAccounts: function(options) {
			this.showMyAccount(_.extend(options || {}, {
				nav: 'accounts'
			}));
		},

		showMyPasswords: function(options) {
			this.showMyAccount(_.extend(options || {}, {
				nav: 'passwords'
			}));
		},

		showMyClasses: function(options) {
			this.showMyAccount(_.extend(options || {}, {
				nav: 'classes'
			}));
		},

		//
		// user account route handlers
		//

		showUserAccount: function(userUid, options) {
			var self = this;
			require([
				'registry',
				'models/users/user',
				'views/users/accounts/user-account-view',
				'views/dialogs/error-view'
			], function (Registry, User, UserAccountView, ErrorView) {

				// fetch user associated with account
				//
				var user = new User({
					'user_uid': userUid
				});

				user.fetch({

					// callbacks
					//
					success: function() {

						// show content view
						//
						Registry.application.showContent({
							nav1: 'home',
							nav2: 'overview', 

							// callbacks
							//
							done: function(view) {

								// show user account view
								//
								view.content.show(
									new UserAccountView({
										model: user,
										nav: options? options.nav : 'profile'
									})
								);

								if (options && options.done) {
									options.done();
								}
							}
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not find this user."
							})
						);
					}
				});
			});
		},

		showEditUserAccount: function(userUid, options) {
			var self = this;
			require([
				'registry',
				'models/users/user',
				'views/users/accounts/edit/edit-user-account-view',
				'views/dialogs/error-view'
			], function (Registry, User, EditUserAccountView, ErrorView) {

				// fetch user associated with account
				//
				var user = new User({
					'user_uid': userUid
				});

				user.fetch({

					// callbacks
					//
					success: function() {

						// show content view
						//
						Registry.application.showContent({
							nav1: 'home',
							nav2: 'overview', 

							// callbacks
							//
							done: function(view) {

								// show edit user account view
								//
								view.content.show(
									new EditUserAccountView({
										model: user
									})
								);

								if (options && options.done) {
									options.done();
								}
							}
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not find this user."
							})
						);
					}
				});
			});
		},

		showUserAccountPermissions: function(userUid, options) {
			this.showUserAccount(userUid, _.extend(options || {}, {
				nav: 'permissions'
			}));
		},

		showUserLinkedAccounts: function(userUid, options) {
			this.showUserAccount(userUid, _.extend(options || {}, {
				nav: 'accounts'
			}));
		},

		showUserPasswords: function(userUid, options) {
			this.showUserAccount(userUid, _.extend(options || {}, {
				nav: 'passwords'
			}));
		},

		showUserClasses: function(userUid, options) {
			this.showUserAccount(userUid, _.extend(options || {}, {
				nav: 'classes'
			}));
		},

		//
		// user event route handlers
		//

		showEvents: function(queryString) {
			var self = this;
			require([
				'registry',
				'routers/query-string-parser',
				'views/events/events-view'
			], function (Registry, QueryStringParser, EventsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'events', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {
		
							// show project events view
							//
							view.content.show(
								new EventsView({
									model: view.model,
									data: data
								})
							);
						});
					}
				});
			});
		},

		//
		// linked account login route handlers
		//

		showLinkedAccountPrompt: function() {
			require([
				'registry',
				'views/users/prompts/linked-account-prompt-view'
			], function (Registry, LinkedAccountPromptView) {

				// show linked account prompt view
				//
				Registry.application.showMain( 
					new LinkedAccountPromptView({})
				);
			});
		},

		showLinkedAccountLogin: function() {
			require([
				'registry',
				'views/users/prompts/linked-account-login-prompt-view'
			], function (Registry, LinkedAccountLoginPromptView) {

				// show linked account login prompt view
				//
				Registry.application.showMain( 
					new LinkedAccountLoginPromptView({})
				);
			});
		},

		showLinkedAccountError: function(type) {
			require([
				'registry',
				'views/users/prompts/linked-account-error-prompt-view'
			], function (Registry, LinkedAccountErrorPromptView) {

				// show linked account error prompt view
				//
				Registry.application.showMain( 
					new LinkedAccountErrorPromptView({
						'type': type
					})
				);
			});
		},

		//
		// system settings route handlers
		//

		showSettings: function(options) {
			var self = this;
			require([
				'registry',
				'views/admin/settings/settings-view'
			], function (Registry, SettingsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'settings', 

					// callbacks
					//
					done: function(view) {

						// show settings view
						//
						view.content.show(
							new SettingsView({
								nav: Registry.application.config['email_enabled']? (options && options.nav? options.nav : 'restricted-domains') : 'admins'
							})
						);

						if (options && options.done) {
							options.done(view);
						}
					}
				});
			});
		},

		showAdminSettings: function(options) {
			this.showSettings(_.extend(options || {}, {
				nav: 'admins'
			}));
		},

		showEmailSettings: function(options) {
			this.showSettings(_.extend(options || {}, {
				nav: 'email'
			}));
		},

		showInviteAdmins: function() {
			var self = this;
			require([
				'registry',
				'views/admin/settings/system-admins/invitations/invite-admins-view'
			], function (Registry, InviteAdminsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav1: 'settings', 

					// callbacks
					//
					done: function(view) {

						// show invite admins view
						//
						view.content.show(
							new InviteAdminsView({
								model: view.model
							})
						);
					}	
				});
			});
		},

		showConfirmAdminInvitation: function(invitationKey) {
			require([
				'registry',
				'models/admin/admin-invitation',
				'views/admin/settings/system-admins/invitations/confirm-admin-invitation-view',
				'views/admin/settings/system-admins/invitations/invalid-admin-invitation-view'
			], function (Registry, AdminInvitation, ConfirmAdminInvitationView, InvalidAdminInvitationView) {

				// fetch admin invitation
				//
				var adminInvitation = new AdminInvitation({
					'invitation_key': invitationKey
				});

				adminInvitation.confirm({

					// callbacks
					//
					success: function(inviter, invitee) {

						// show confirm admin invitation view
						//
						Registry.application.showMain( 
							new ConfirmAdminInvitationView({
								model: adminInvitation,
								inviter: inviter,
								invitee: invitee
							})
						);
					},

					error: function(message) {
						Registry.application.showMain(
							new InvalidAdminInvitationView({
								message: message
							})
						);
					}
				});
			});
		},

		//
		// status route handlers
		//

		showReviewStatus: function(options) {
			var self = this;
			require([
				'registry',
				'views/admin/status/review-status-view',
				'views/dialogs/error-view',
			], function (Registry, ReviewStatusView, ErrorView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'status', 

					// callbacks
					//
					done: function(view) {

						// show review status view
						//
						view.content.show(new ReviewStatusView());
					}
				});
			});
		},

		showNotFound: function() {
			require([
				'registry',
				'views/not-found-view'
			], function (Registry, NotFoundView) {

				// show about view
				//
				Registry.application.showMain( 
					new NotFoundView()
				);
			});
		}
	});
});
