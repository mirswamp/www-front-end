/******************************************************************************\
|                                                                              |
|                            add-new-password-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a modal dialog box for adding new application            |
|        passwords.                                                            |
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
	'registry',
	'text!templates/users/passwords/dialogs/add-new-password.tpl',
	'models/authentication/app-password',
	'views/users/passwords/forms/password-form-view',
], function($, _, Backbone, Marionette, Registry, Template, AppPassword, PasswordFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			passwordForm: '#password-form',
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #ok': 'onClickOk'
		},

		//
		// methods
		//

		initialize: function() {

			// create new model
			//
			this.model = new AppPassword({
				label: ''
			});
		},

		savePassword: function() {
			var self = this;
			this.model.save(undefined, {

				// callbalcks
				//
				success: function(model) {

					// add model to collection
					//
					self.collection.add(model);

					// display newly created password
					//
					self.showPassword(model);
				},

				error: function(data, response) {
					response = JSON.parse(response.responseText);

					Registry.application.notify({
						title: response.error.toTitleCase(),
						message: response.error_description
					});
				}
			})
		},

		showPassword: function(model) {
			require([
				'registry',
				'views/users/passwords/dialogs/new-password-view',
			], function (Registry, NewPasswordView) {
				Registry.application.modal.show(
					new NewPasswordView({
						model: model
					})
				);
			});

			/*
			Registry.application.notify({
				message: "Your new application password is: " + model.get('password') + '. ' +
					"Please make a note of it since it won't be retrievable once this dialog box is dismissed."
			});
			*/
		},

		//
		// rendering methods
		//

		onRender: function() {

			// show subviews
			//
			this.showPasswordForm();
		},

		showPasswordForm: function() {
			var self = this;
			this.passwordForm.show(
				new PasswordFormView({
					model: this.model,

					// callbacks
					//
					onChange: function() {
						if (self.passwordForm.currentView.isValid()) {
							self.enableButtons();
						} else {
							self.disableButtons();
						}
					}
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
		// button enabling / disabling methods
		//

		enableButtons: function() {
			this.$el.find('#ok').removeAttr('disabled');
		},

		disableButtons: function() {
			this.$el.find('#ok').attr('disabled','disabled');
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickOk: function() {
			if (this.passwordForm.currentView.isValid()) {

				// update model
				//
				this.passwordForm.currentView.update(this.model);

				// save password to server
				//
				this.savePassword();
			} else {
				this.showWarning();
				return false;
			}
		}
	});
});
