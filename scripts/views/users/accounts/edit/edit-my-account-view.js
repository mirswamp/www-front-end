/******************************************************************************\
|                                                                              |
|                               edit-my-account-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for editing the user's account information.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/accounts/edit/edit-my-account.tpl',
	'views/base-view',
	'views/users/dialogs/user-validation-error-dialog-view',
	'views/users/accounts/user-profile/user-profile-form-view'
], function($, _, Template, BaseView, UserValidationErrorDialogView, UserProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: "#user-profile-form"
		},

		events: {
			'change select': 'onChangeInput',
			'input input, textarea': 'onChangeInput',
			'keyup input, textarea, select': 'onChangeInput',
			'click .alert .close': 'onClickAlertClose',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// contructor
		//

		initialize: function() {
			this.model = application.session.user.clone();
		},

		//
		// rendering methods
		//

		onRender: function() {
			this.showChildView('form', new UserProfileFormView({
				model: this.model
			}));
		},

		showWarning: function() {
			this.$el.find(".alert-warning").show();
		},

		hideWarning: function() {
			this.$el.find(".alert-warning").hide();
		},

		//
		// event handling methods
		//

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickSave: function() {
			var self = this;

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// update model from form
				//
				this.getChildView('form').applyTo(this.model);

				// check to see if model is valid
				//
				var response = this.model.checkValidation(this.model.changedAttributes(), {

					// callbacks
					//
					success: function() {

						// prevent ownership emails from being sent
						//
						self.model.unset(
							"owner"
						);

						// disable save button
						//
						self.$el.find('#save').prop('disabled', true);

						// save user profile
						//
						self.model.save(undefined, {

							// callbacks
							//
							success: function() {

								// update user
								//
								application.setUser(self.model);

								// notify user
								//
								if (self.model.changed.email) {

									// show notification message
									//
									application.notify({
										title: "My Email Updated",
										message: "An email verification link has been sent to your new email address. Please follow the link in the email to change your email address. Your previous email address will remain in effect until you do so.",

										// callbacks
										//
										accept: function() {

											// return to my account view
											//
											application.navigate("#my-account");
										}
									});
								} else {

									// return to my account view
									//
									application.navigate("#my-account");				
								}
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not save user profile changes."
								});
							}
						});
					},

					error: function(response) {
						var errors = JSON.parse(response.responseText);

						// show validation error dialog
						//
						application.show(new UserValidationErrorDialogView({
							errors: errors
						}));
					}
				});
			} else {
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to my account view
			//
			application.navigate("#my-account");
		}
	});
});
