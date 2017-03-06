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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/accounts/edit/edit-my-account.tpl',
	'registry',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/users/dialogs/user-validation-error-view',
	'views/users/user-profile/user-profile-form-view'
], function($, _, Backbone, Marionette, Template, Registry, NotifyView, ErrorView, UserValidationErrorView, UserProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			userProfileForm: "#user-profile-form"
		},

		events: {
			'change input, textarea, select': 'onChangeInput',
			'keyup input, textarea, select': 'onChangeInput',
			'click .alert .close': 'onClickAlertClose',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {
			this.model = Registry.application.session.user;
		},

		//
		// rendering methods
		//

		onRender: function() {
			this.userProfileForm.show(
				new UserProfileFormView({
					model: this.model
				})
			);
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
			if (this.userProfileForm.currentView.isValid()) {

				// update model from form
				//
				this.userProfileForm.currentView.update(this.model);

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

								// notify user
								//
								if (self.model.changed.email) {

									// show notification dialog
									//
									Registry.application.modal.show(
										new NotifyView({
											title: "My Email Updated",
											message: "An email verification link has been sent to your new email address. Please follow the link to change your email address. Your previous email address will remain in effect until you do so.",

											// callbacks
											//
											accept: function() {

												// return to my account view
												//
												Backbone.history.navigate("#my-account", {
													trigger: true
												});
											}
										})
									);
								} else {

									// return to my account view
									//
									Backbone.history.navigate("#my-account", {
										trigger: true
									});				
								}
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not save user profile changes."
									})
								);
							}
						});
					},

					error: function(response) {
						var errors = JSON.parse(response.responseText);

						// show validation errors dialog
						//
						Registry.application.modal.show(
							new UserValidationErrorView({
								errors: errors
							})
						);
					}
				});
			} else {
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to my account view
			//
			Backbone.history.navigate("#my-account", {
				trigger: true
			});
		}
	});
});
