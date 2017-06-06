/******************************************************************************\
|                                                                              |
|                              edit-password-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a modal dialog box for editing application               |
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
	'text!templates/users/passwords/dialogs/edit-password.tpl',
	'models/authentication/app-password',
	'views/users/passwords/forms/password-form-view',
], function($, _, Backbone, Marionette, Template, AppPassword, PasswordFormView) {
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
			'click #save': 'onClickSave'
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
			this.$el.find('#save').removeAttr('disabled');
		},

		disableButtons: function() {
			this.$el.find('#save').attr('disabled','disabled');
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickSave: function() {
			var self = this;
			if (this.passwordForm.currentView.isValid()) {

				// update model
				//
				this.passwordForm.currentView.update(this.model);

				// save password to server
				//
				this.model.save(undefined, {

					// callbacks
					//
					success: function() {
						self.model.collection.trigger('change');
					}
				});
			} else {
				this.showWarning();
				return false;
			}
		}
	});
});
