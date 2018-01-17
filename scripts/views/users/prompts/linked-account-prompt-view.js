/******************************************************************************\
|                                                                              |
|                         linked-account-prompt-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the prompt view used in the linked account               |
|        authentication process.                                               |
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
	'bootstrap/tooltip',
	'bootstrap/popover',
	'text!templates/users/prompts/linked-account-prompt.tpl',
	'text!templates/policies/linked-account-policy.tpl',
	'registry',
	'config',
	'utilities/security/password-policy',
	'models/users/user',
	'models/users/session',
	'views/users/registration/sign-aup-view',
	'views/users/prompts/linked-account-link-prompt-view',
	'views/users/registration/email-verification-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template, LinkedAccountPolicyTemplate, Registry, Config, PasswordPolicy, User, Session, SignAupView, LinkedAccountLinkPromptView, EmailVerificationView, NotifyView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			linkedAccountPolicyText: '#linked-account-policy-text'
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
			return _.template(LinkedAccountPolicyTemplate, {
				passwordPolicy: passwordPolicy
			});
		},

		template: function() {
			return _.template(Template, {
				config: Registry.application.config
			});
		},

		onRender: function() {

			// show subview
			//
			this.$el.find('#linked-account-policy-text').html(this.getPolicyText());

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

		loadLinkedAccountUser: function(options) {
			User.fetchFromLinkedAccount(_.extend(options, {

				// callbacks
				//
				error: function(response) {
					Registry.application.modal.show(
						new NotifyView({
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

		registerLinkedAccountUser: function(options) {
			User.registerWithLinkedAccount(_.extend(options, {

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
				self.loadLinkedAccountUser({

					// callbacks
					//
					success: function(response) {
						Registry.application.showMain(
							new LinkedAccountLinkPromptView({
								oauth2_id: 	response.user_external_id,
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
					new SignAupView({

						// callbacks
						//
						accept: function(){
							self.registerLinkedAccountUser({

								// callbacks
								//
								success: function(response) {
									if (response.primary_verified) {
										Registry.application.modal.show(
											new NotifyView({
												message: "Your Account has successfuly been linked to the SWAMP!",
												
												// callbacks
												//
												accept: function() {
													window.location = Registry.application.getURL();
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
