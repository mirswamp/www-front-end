/******************************************************************************\
|                                                                              |
|                             github-prompt-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the acceptable use policy view used in the new           |
|        GitHub link process.                                                  |
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
	'tooltip',
	'popover',
	'text!templates/users/prompts/github-prompt.tpl',
	'text!templates/policies/github-policy.tpl',
	'registry',
	'config',
	'utilities/password-policy',
	'models/users/user',
	'models/users/session',
	'views/users/registration/aup-view',
	'views/users/prompts/github-link-prompt-view',
	'views/users/registration/email-verification-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template, GitHubPolicyTemplate, Registry, Config, PasswordPolicy, User, Session, AupView, GitHubLinkPromptView, EmailVerificationView, NotifyView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			githubPolicyText: '#github-policy-text'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #register-new': 'onClickRegisterNew',
			'click #link-existing': 'onClickLinkExisting',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		getPolicyText: function(data) {
			return _.template(GitHubPolicyTemplate, {
				passwordPolicy: passwordPolicy
			});
		},

		onRender: function() {

			// show subview
			//
			this.$el.find('#github-policy-text').html(this.getPolicyText());

			// validate form
			//
			this.validator = this.validate();

			// scroll to top
			//
			var el = this.$el.find('h1');
			el[0].scrollIntoView(true);

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('#accept-form').validate({
				rules: {
					'accept': {
						required: true
					}
				},
				messages: {
					'accept': {
						required: "You must accept the terms to continue."
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// event handling methods
		//

		loadGitHubUser: function(options) {
			User.fetchFromGithub(_.extend(options, {

				// callbacks
				//
				error: function(response) {
					Registry.application.modal.show(
						new ErrorView({
							message: response.responseText,

							// callbacks
							//
							accept: function() {
								Backbone.history.navigate('#home', {
									trigger: true
								});
							}
						})
					);
				}
			}));
		},

		registerGitHubUser: function(options) {
			User.registerWithGithub(_.extend(options, {

				// callbacks
				//
				error: function(response) {
					Registry.application.modal.show(
						new ErrorView({
							message: response.responseText,

							// callbacks
							//
							accept: function(){
								Backbone.history.navigate('#home', {
									trigger: true
								});
							}
						})
					);
				}
			}));
		},

		onClickLinkExisting: function() {
			var self = this;

			// check validation
			//
			if (this.isValid()) {
				self.undelegateEvents();
				self.loadGitHubUser({

					// callbacks
					//
					success: function(response) {
						Registry.application.showMain(
							new GitHubLinkPromptView({
								github_id: 	response.user_external_id,
								username: 	response.username,
								email: 		response.email
							})
						);
					}
				});
			}
		},

		onClickRegisterNew: function() {
			var self = this;

			// check validation
			//
			if (this.isValid()) {
				self.undelegateEvents();
				Registry.application.showMain(
					new AupView({

						// callbacks
						//
						accept: function(){
							self.registerGitHubUser({

								// callbacks
								//
								success: function(response) {
									if (response.primary_verified) {
										Registry.application.modal.show(
											new NotifyView({
												message: "Your GitHub Account has successfuly been linked to the SWAMP!",
												
												// callbacks
												//
												accept: function() {
													Session.githubRedirect();
												}
											})
										);
									} else {
										Registry.application.showMain(
											new EmailVerificationView({
												model: new User(response.user)
											})
										);
									}
								}
							});
						}
					})
				);
			}
		},

		onClickCancel: function() {

			// go to home view
			//
			Backbone.history.navigate('#home', {
				trigger: true
			});
		}
	});
});
