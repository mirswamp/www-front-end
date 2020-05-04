/******************************************************************************\
|                                                                              |
|                           user-registration-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the introductory view of the application.                |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/registration/user-registration.tpl',
	'models/users/user',
	'models/users/email-verification',
	'collections/users/user-classes',
	'views/base-view',
	'views/users/accounts/user-profile/new-user-profile-form-view',
	'views/users/registration/email/email-verification-view'
], function($, _, Template, User, EmailVerification, UserClasses, BaseView, NewUserProfileFormView, EmailVerificationView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#new-user-profile'
		},

		events: {
			'click #aup': 'onClickAup',
			'click .alert .close': 'onClickAlertClose',
			'click #submit': 'onClickSubmit',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {
			this.model = new User({});
		},

		verifyEmail: function() {
			var self = this;

			// create a new email verification
			//
			var emailVerification = new EmailVerification({
				user_uid: this.model.get('user_uid'),
				email: this.model.get('email')
			});

			// save email verification
			//
			emailVerification.save({
				verify_route: '#register/verify-email'
			}, {
				// callbacks
				//
				success: function() {

					// show email verification view
					//
					application.show(new EmailVerificationView({
						model: self.model
					}));
				},

				error: function() {

					// show error
					//
					application.error({
						message: "Could not save email verification."
					});
				}
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// check for student registration
			//
			if (application.config.classes_enabled) {

				// fetch user classes
				//
				new UserClasses().fetch({

					// callbacks
					//
					success: function(collection) {

						// display user profile form
						//
						self.showChildView('form', new NewUserProfileFormView({
							model: self.model,
							classes: collection
						}));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch user classes."
						});
					}
				});
			} else {

				// display user profile form
				//
				this.showChildView('form', new NewUserProfileFormView({
					model: this.model
				}));	
			}
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// dialog rendering methods
		//

		showUserValidationError: function(errors) {
			require([
				'views/users/registration/dialogs/user-validation-error-dialog-view',
			], function(UserValidationErrorDialogView) {

				// show user validation dialog
				//
				application.show(new UserValidationErrorDialogView({
					errors: errors
				}));
			});
		},

		//
		// event handling methods
		//

		onClickAup: function() {
			Backbone.history.fragment = null;

			// go to aup view
			//
			Backbone.history.navigate('#register', {
				trigger: true
			});
		},

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickSubmit: function() {
			var self = this;

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// update model from form
				//
				this.model.set(this.getChildView('form').getValues());

				// check to see if model is valid
				//
				var response = this.model.checkValidation(this.model.toJSON(), {

					// callbacks
					//
					success: function() {

						// create new user
						//
						self.model.save(undefined, {

							// callbacks
							//
							success: function() {

								// verify email
								//
								if (application.config.email_enabled) {
									self.verifyEmail();
								} else {

									// go to sign in view
									//
									Backbone.history.navigate('#sign-in', {
										trigger: true
									});
								}
							},

							error: function() {

								// show error
								//
								application.error({
									message: "Could not create new user."
								});
							}
						});
					},

					error: function() {

						// show user validation dialog
						//
						self.showUserValidationError(JSON.parse(response.responseText));
					}
				});
			} else {

				// display error message
				//
				this.showWarning();
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
