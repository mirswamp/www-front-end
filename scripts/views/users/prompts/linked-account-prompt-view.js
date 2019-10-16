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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/popover',
	'text!templates/users/prompts/linked-account-prompt.tpl',
	'text!templates/policies/linked-account-policy.tpl',
	'utilities/security/password-policy',
	'models/users/user',
	'models/users/session',
	'collections/users/user-classes',
	'views/base-view',
	'views/users/registration/sign-aup-view',
	'views/users/prompts/linked-account-link-prompt-view',
	'views/users/registration/email-verification-view',
	'views/users/classes/dialogs/class-enrollment-dialog-view',
], function($, _, Popover, Template, LinkedAccountPolicyTemplate, PasswordPolicy, User, Session, UserClasses, BaseView, SignAupView, LinkedAccountLinkPromptView, EmailVerificationView, ClassEnrollmentDialogView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #register-new': 'onClickRegisterNew',
			'click #link-existing': 'onClickLinkExisting',
			'click #cancel': 'onClickCancel'
		},

		//
		// form attributes
		//

		rules: {
			'accept': {
				required: true
			}
		},

		messages: {
			'accept': {
				required: "You must accept the terms to continue."
			}
		},

		//
		// querying methods
		//

		isAcademicLinkedAccount: function() {
			var authProvider = application.options.authProvider;
			return authProvider && (
				authProvider.contains('University', false) ||
				authProvider.contains('College', false) || 
				authProvider.contains('School', false) ||
				authProvider.contains('Institute', false) ||
				authProvider.contains('Academic', false));
		},

		//
		// methods
		//

		checkClassEnrollment: function(callback) {
			var self = this;

			// fetch user classes
			//
			new UserClasses().fetch({

				// callbacks
				//
				success: function(collection) {
					if (collection && collection.length > 0) {

						// display class enrollment dialog
						//
						application.show(new ClassEnrollmentDialogView({
							collection: collection,

							// callbacks
							//
							accept: function(userClass) {
								callback(userClass);
							}
						}));
					} else {

						// no classes available
						//
						callback();
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch user classes."
					});
				}
			});
		},

		registerLinkedAccount: function(options) {
			this.registerLinkedAccountUser({
				data: {
					'class_code': options && options['user-class']? options['user-class'].get('class_code') : null,
				},

				// callbacks
				//
				success: function(response) {
					if (response.primary_verified) {

						// show notification
						//
						application.notify({
							message: "Your Account has successfuly been linked to the SWAMP!",
							
							// callbacks
							//
							accept: function() {
								window.location = application.getURL();
							}
						});
					} else {
						application.showMain(new EmailVerificationView({
							model: new User(response.user)
						}));
					}
				}
			});
		},

		//
		// querying methods
		//

		getPolicyText: function(data) {
			return _.template(LinkedAccountPolicyTemplate, {
				passwordPolicy: passwordPolicy
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				config: application.config
			};
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
				rules: this.rules,
				messages: this.messages
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

					// show notification
					//
					application.notify({
						message: response.responseText,

						// callbacks
						//
						accept: function() {
							Backbone.history.navigate('#home', {
								trigger: true
							});
						}
					});
				}
			}));
		},

		registerLinkedAccountUser: function(options) {
			User.registerWithLinkedAccount(_.extend(options, {

				// callbacks
				//
				error: function(response) {

					// show confirm dialog
					//
					application.confirm({
						message: response.responseText,

						// callbacks
						//
						accept: function(){
							Backbone.history.navigate('#home', {
								trigger: true
							});
						}
					});
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
						application.showMain(new LinkedAccountLinkPromptView({
							oauth2_id: response.user_external_id,
							username: response.username,
							email: response.email
						}));
					}
				});
			}
		},

		onClickRegisterNew: function() {
			var self = this;

			// check validation
			//
			if (this.isValid()) {
				this.undelegateEvents();
				application.showMain(new SignAupView({

					// callbacks
					//
					accept: function() {
						if (application.config['classes_enabled'] &&
							self.isAcademicLinkedAccount()) {

							// check class enrollment
							//
							self.checkClassEnrollment(function(userClass) {
								if (userClass) {

									// user class was selected
									//
									self.registerLinkedAccount({
										'user-class': userClass
									});
								} else {

									// no class selected - register with no class enrollment
									//
									self.registerLinkedAccount();	
								}
							});
						} else {

							// register with no class enrollment
							//
							self.registerLinkedAccount();
						}
					}
				}));
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
