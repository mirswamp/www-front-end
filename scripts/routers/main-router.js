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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'routers/base-router'
], function($, _, BaseRouter) {

	// create router
	//
	return BaseRouter.extend({

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
				'config',
				'views/welcome-view'
			], function (Config, WelcomeView) {
				var user = application.session.user;

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
				application.showPage(new WelcomeView());

				// show welcome message
				//
				if (Config.notifications && Config.notifications.welcome) {
					application.notify({
						title: Config.notifications.welcome.title,
						message: Config.notifications.welcome.message
					});
				}
			});
		},

		showSignIn: function() {
			var self = this;
			require([
				'views/welcome-view'
			], function (WelcomeView) {
				var user = application.session.user;

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
				application.showPage(new WelcomeView({
					showSignIn: true
				}));
			});
		},

		showAbout: function(anchor) {
			require([
				'views/info/about-view'
			], function (AboutView) {

				// show about view
				//
				application.showMain(new AboutView({
					'anchor': anchor
				}), {
					nav: 'about'
				});
			});
		},

		showHelp: function() {
			require([
				'views/info/help-view'
			], function (HelpView) {

				// show help view
				//
				application.showMain(new HelpView(), {
					nav: 'help'
				});
			});
		},

		showResources: function() {
			require([
				'views/info/resources-view'
			], function (ResourcesView) {

				// show resources view
				//
				application.showMain(new ResourcesView(), {
					nav: 'resources'
				});
			});
		},

		showHeartbit: function() {
			require([
				'views/info/resources/heartbit-view'
			], function (HeartbitView) {

				// show heartbit view
				//
				application.showMain(new HeartbitView(), {
					nav: 'resources'
				});
			});
		},

		showPolicies: function() {
			require([
				'views/info/policies-view'
			], function (PoliciesView) {
				application.showMain(new PoliciesView(), {
					nav: 'policies'
				});
			});
		},

		showPolicy: function(policyName) {
			require([
				'views/policies/policy-view',
			], function (PolicyView) {
				application.showMain(new PolicyView({
					template_file: 'text!templates/policies/' + policyName + '.tpl'
				}), {
					nav: 'policies'
				});
			});
		},

		showMailingListSubscribe: function() {
			require([
				'views/info/mailing-list/subscribe-view'
			], function (SubscribeView) {

				// show subscribe view
				//
				application.showMain(new SubscribeView(), {
					nav: 'about'
				});
			});
		},

		//
		// contact / feedback route handlers
		//

		showContactUs: function() {
			require([
				'views/contacts/contact-us-view'
			], function (ContactUsView) {

				// show contact us view
				//
				application.showMain(new ContactUsView(), {
					nav: 'contact'
				});
			});
		},

		showReportIncident: function() {
			require([
				'views/contacts/report-incident-view'
			], function (ReportIncidentView) {

				// show report incident view
				//
				application.showMain(new ReportIncidentView(), {
					nav: 'contact'
				});
			});
		},

		//
		// user registration route handlers
		//

		showRegister: function() {
			require([
				'views/users/registration/sign-aup-view'
			], function (SignAupView) {

				// show aup view
				//
				application.showMain(new SignAupView());
			});
		},

		showVerifyEmail: function(verificationKey) {
			require([
				'models/users/user',
				'models/users/email-verification',
				'views/users/registration/verify-email-view'
			], function (User, EmailVerification, VerifyEmailView) {

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
						application.showMain(new VerifyEmailView({
							model: model
						}));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "We could not verify this user."
						});
					}
				});
			});
		},

		showVerifyEmailChange: function(verificationKey) {
			require([
				'models/users/user',
				'models/users/email-verification',
				'views/users/registration/verify-email-changed-view'
			], function (User, EmailVerification, VerifyEmailChangedView) {

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
						application.showMain(new VerifyEmailChangedView({
							model: model
						}));
					},

					error: function() {

						// show notification
						//
						application.notify({
							message: "We could not verify this user."
						});
					}
				});
			});
		},

		//
		// password reset route handlers
		//

		showResetPassword: function(passwordResetUuid, passwordResetNonce) {
			require([
				'models/users/user',
				'models/users/password-reset',
				'views/users/reset-password/reset-password-view',
				'views/users/reset-password/invalid-reset-password-view'
			], function (User, PasswordReset, ResetPasswordView, InvalidResetPasswordView) {

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
						application.showMain(new ResetPasswordView({
							model: model
						}));
					},

					error: function(model) {

						// show invalid reset password view
						//
						application.showMain(new InvalidResetPasswordView({
							model: model
						}));
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
				'views/admin/overview/system-overview-view'
			], function (SystemOverviewView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'overview', 

					// callbacks
					//
					done: function(view) {

						// show admin dashboard view
						//
						view.showChildView('content', new SystemOverviewView());

						// perform callback
						//
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
				'views/admin/overview/overview-view'
			], function (OverviewView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'overview', 

					// callbacks
					//
					done: function(view) {

						// show overview view
						//
						view.showChildView('content', new OverviewView({
							nav: options.nav,
							data: options.data
						}));

						// perform callback
						//
						if (options && options.done) {
							options.done();
						}
					}
				});
			});
		},
		
		showReviewAccounts: function(queryString) {
			require([
				'routers/query-string-parser',
				'views/users/review/review-accounts-view',
			], function (QueryStringParser, ReviewAccountsView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'overview', 

					// callbacks
					//
					done: function(view) {

						// show overview view
						//
						view.showChildView('content', new ReviewAccountsView({
							data: QueryStringParser.parse(queryString, view.model)
						}));
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
				'views/home-view'
			], function (HomeView) {
				var user = application.session.user;

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
				application.showPage(new HomeView({
					nav: options? options.nav : 'home'
				}), options);
			});
		},

		showMyAccount: function(options) {
			var self = this;
			require([
				'views/users/accounts/my-account-view'
			], function (MyAccountView) {

				// show content view
				//
				application.showContent({
					nav1: 'my-account',
					nav2: undefined,

					// callbacks
					//
					done: function(view) {

						// show user account view
						//
						view.showChildView('content', new MyAccountView({
							nav: options && options.nav? options.nav : 'profile'
						}));

						// perform callback
						//
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
				'views/users/accounts/edit/edit-my-account-view'
			], function (EditMyAccountView) {

				// show content view
				//
				application.showContent({
					nav1: 'my-account',
					nav2: undefined,

					// callbacks
					//
					done: function(view) {

						// show edit user account view
						//
						view.showChildView('content', new EditMyAccountView({
							parent: view
						}));

						// perform callback
						//
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
				'models/users/user',
				'views/users/accounts/user-account-view',
			], function (User, UserAccountView) {

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
						application.showContent({
							nav1: 'home',
							nav2: 'overview', 

							// callbacks
							//
							done: function(view) {

								// show user account view
								//
								view.showChildView('content', new UserAccountView({
									model: user,
									nav: options? options.nav : 'profile'
								}));

								// perform callback
								//
								if (options && options.done) {
									options.done();
								}
							}
						});
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not find this user."
						});
					}
				});
			});
		},

		showEditUserAccount: function(userUid, options) {
			var self = this;
			require([
				'models/users/user',
				'views/users/accounts/edit/edit-user-account-view',
			], function (User, EditUserAccountView) {

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
						application.showContent({
							nav1: 'home',
							nav2: 'overview', 

							// callbacks
							//
							done: function(view) {

								// show edit user account view
								//
								view.showChildView('content', new EditUserAccountView({
									model: user
								}));

								// perform callback
								//
								if (options && options.done) {
									options.done();
								}
							}
						});
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not find this user."
						});
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
				'routers/query-string-parser',
				'views/events/events-view'
			], function (QueryStringParser, EventsView) {

				// show content view
				//
				application.showContent({
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
							view.showChildView('content', new EventsView({
								model: view.model,
								data: data
							}));
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
				'views/users/prompts/linked-account-prompt-view'
			], function (LinkedAccountPromptView) {

				// show linked account prompt view
				//
				application.showMain(new LinkedAccountPromptView({}));
			});
		},

		showLinkedAccountLogin: function() {
			require([
				'views/users/prompts/linked-account-login-prompt-view'
			], function (LinkedAccountLoginPromptView) {

				// show linked account login prompt view
				//
				application.showMain(new LinkedAccountLoginPromptView({}));
			});
		},

		showLinkedAccountError: function(type) {
			require([
				'views/users/prompts/linked-account-error-prompt-view'
			], function (LinkedAccountErrorPromptView) {

				// show linked account error prompt view
				//
				application.showMain(new LinkedAccountErrorPromptView({
					'type': type
				}));
			});
		},

		//
		// system settings route handlers
		//

		showSettings: function(options) {
			var self = this;
			require([
				'views/admin/settings/settings-view'
			], function (SettingsView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'settings', 

					// callbacks
					//
					done: function(view) {

						// show settings view
						//
						view.showChildView('content', new SettingsView({
							nav: application.config['email_enabled']? (options && options.nav? options.nav : 'restricted-domains') : 'admins'
						}));

						// perform callback
						//
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
				'views/admin/settings/system-admins/invitations/invite-admins-view'
			], function (InviteAdminsView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'settings', 

					// callbacks
					//
					done: function(view) {

						// show invite admins view
						//
						view.showChildView('content', new InviteAdminsView({
							model: view.model
						}));
					}	
				});
			});
		},

		showConfirmAdminInvitation: function(invitationKey) {
			require([
				'models/admin/admin-invitation',
				'views/admin/settings/system-admins/invitations/confirm-admin-invitation-view',
				'views/admin/settings/system-admins/invitations/invalid-admin-invitation-view'
			], function (AdminInvitation, ConfirmAdminInvitationView, InvalidAdminInvitationView) {

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
						application.showMain(new ConfirmAdminInvitationView({
							model: adminInvitation,
							inviter: inviter,
							invitee: invitee
						}));
					},

					error: function(message) {
						application.showMain(new InvalidAdminInvitationView({
							message: message
						}));
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
				'views/admin/status/review-status-view',
			], function (ReviewStatusView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'status', 

					// callbacks
					//
					done: function(view) {

						// show review status view
						//
						view.showChildView('content', new ReviewStatusView());
					}
				});
			});
		},

		showNotFound: function() {
			require([
				'views/not-found-view'
			], function (NotFoundView) {

				// show about view
				//
				application.showMain(new NotFoundView());
			});
		}
	});
});
