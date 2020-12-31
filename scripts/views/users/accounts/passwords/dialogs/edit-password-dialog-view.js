/******************************************************************************\
|                                                                              |
|                         edit-password-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box for editing app passwords.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/accounts/passwords/dialogs/edit-password-dialog.tpl',
	'models/authentication/app-password',
	'views/dialogs/dialog-view',
	'views/users/accounts/passwords/forms/password-form-view',
], function($, _, Template, AppPassword, DialogView, PasswordFormView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#password-form',
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
			this.showChildView('form', new PasswordFormView({
				model: this.model,

				// callbacks
				//
				onChange: function() {
					if (self.getChildView('form').isValid()) {
						self.enableButtons();
					} else {
						self.disableButtons();
					}
				}
			}));
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
			if (this.getChildView('form').isValid()) {

				// save password to server
				//
				this.model.save(this.getChildView('form').getValues(), {

					// callbacks
					//
					success: function() {
						self.model.collection.trigger('change');

						// perform callback
						//
						if (self.options.onSave) {
							self.options.onSave();
						}
					}
				});
			} else {
				this.showWarning();
				return false;
			}
		}
	});
});
