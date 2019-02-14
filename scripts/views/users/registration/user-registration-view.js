/******************************************************************************\
|                                                                              |
|                             user-registration-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the introductory view of the application.                |
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
	'backbone',
	'marionette',
	'text!templates/users/registration/user-registration.tpl',
	'registry',
	'models/users/user',
	'models/users/email-verification',
	'collections/users/user-classes',
	'views/dialogs/error-view',
	'views/dialogs/notify-view',
	'views/users/dialogs/user-validation-error-view',
	'views/users/user-profile/new-user-profile-form-view'
], function($, _, Backbone, Marionette, Template, Registry, User, EmailVerification, UserClasses, ErrorView, NotifyView, UserValidationErrorView, NewUserProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			newUserProfile: '#new-user-profile'
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
					require([
						'views/users/registration/email-verification-view',
					], function (EmailVerificationView) {
						// show email verification view
						//
						Registry.application.showMain(
							new EmailVerificationView({
								model: self.model
							})
						);
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save email verification."
						})
					);
				}
			});
		},

		accountCreated: function() {
			var self = this;
			require([
				'views/users/registration/account-created-view'
			], function (AccountCreatedView) {

				// show account created view
				//
				Registry.application.showMain(
					new AccountCreatedView({
						model: self.model
					})
				);
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// check for student registration
			//
			if (Registry.application.config['classes_enabled']) {

				// fetch user classes
				//
				new UserClasses().fetch({

					// callbacks
					//
					success: function(collection) {

						// display user profile form
						//
						self.newUserProfile.show(
							new NewUserProfileFormView({
								model: self.model,
								classes: collection
							})
						);
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch user classes."
							})
						);
					}
				});
			} else {

				// display user profile form
				//
				this.newUserProfile.show(
					new NewUserProfileFormView({
						model: this.model
					})
				);	
			}

			// scroll to top
			//
			var el = this.$el.find('h1');
			el[0].scrollIntoView(true);
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
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
			if (this.newUserProfile.currentView.isValid()) {

				// update model from form
				//
				this.newUserProfile.currentView.update(this.model);

				// check to see if model is valid
				//
				var response = this.model.checkValidation(this.model.toJSON(), {

					// callbacks
					//
					success: function() {

						// create new user
						//
						var response2 = self.model.save(undefined, {

							// callbacks
							//
							success: function() {

								// complete registration
								//
								if (Registry.application.config['email_enabled']) {
									self.verifyEmail();
								} else {
									self.accountCreated();
								}
							},

							error: function() {

								// Check for extended LDAP error message in the response
								//
								var responseText = '';
								var responseJSON = JSON.parse(response2.responseText);
								if ((responseJSON !== null) && 
									(responseJSON.error !== null)) {

									// Set the additional output to the error message
									//
									responseText = responseJSON.error;

									// Check for extended LDAP password policy module error message
									// like "Constraint violation: 100: password less than 10 chars"
									//
									var regex = /.+: \d\d\d: (.+):.+/;
									if (responseText.match(regex)) {
										responseText = responseText.replace(regex,"$1");
									}
								}

								// show notify dialog
								//
								Registry.application.modal.show(
									new NotifyView({
										message: "Could not create new user" + (responseText? ' because "' + responseText + '"' : '') + "."
									})
								);
							}
						});
					},

					error: function() {
						var errors = JSON.parse(response.responseText);

						// show user validation dialog
						//
						Registry.application.modal.show(
							new UserValidationErrorView({
								errors: errors
							})
						);
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
