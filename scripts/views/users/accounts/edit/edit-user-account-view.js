/******************************************************************************\
|                                                                              |
|                              edit-user-account-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for editing a user's account information.         |
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
	'text!templates/users/accounts/edit/edit-user-account.tpl',
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
			userProfileForm: '#user-profile-form'
		},

		events: {
			'change input, textarea, select': 'onChangeInput',
			'keyup input, textarea, select': 'onChangeInput',
			'click .alert .close': 'onClickAlertClose',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {
			this.userProfileForm.show(
				new UserProfileFormView({
					model: this.model
				})
			);
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
							'owner'
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

									// show success notification dialog
									//
									Registry.application.modal.show(
										new NotifyView({
											title: "User Email Updated",
											message: "An email verification link has been sent to the new email address. The previous email address will remain in effect until the new address is verified.",

											// callbacks
											//
											accept: function() {

												// return to user account view
												//
												Backbone.history.navigate('#accounts/' + self.model.get('user_uid'), {
													trigger: true
												});
											}
										})
									);
								} else {
									
									// return to user account view
									//
									Backbone.history.navigate('#accounts/' + self.model.get('user_uid'), {
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
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to user accounts view
			//
			Backbone.history.navigate('#accounts/' + this.model.get('user_uid'), {
				trigger: true
			});
		}
	});
});
