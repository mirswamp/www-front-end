/******************************************************************************\
|                                                                              |
|                       change-my-password-dialog-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box for changing the current user's             |
|        password.                                                             |
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
	'text!templates/users/accounts/dialogs/change-password/change-my-password-dialog.tpl',
	'views/dialogs/dialog-view',
	'views/users/accounts/forms/change-password/change-password-form-view'
], function($, _, Template, DialogView, ChangePasswordFormView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '.modal-body'
		},

		events: {
			"click #submit": "onClickSubmit",
		},

		//
		// constructor
		//

		initialize: function() {
			this.model = application.session.user;
		},

		//
		// methods
		//

		changePassword: function(currentPassword, newPassword) {
			var self = this;
			
			// change current user's password
			//
			this.model.changePassword(currentPassword, newPassword, {

				// callbacks
				//
				success: function() {

					// close dialog
					//
					self.hide();

					// show success notify message
					//
					application.notify({
						title: "My Password Changed",
						message: "Your user password has been successfully changed.",

						// callbacks
						//
						accept: function() {

							// return to my account view
							//
							application.navigate("#my-account");
						}
					});
				},

				error: function(response) {

					// get response text
					//
					var responseText = response.responseText;

					// Decode LDAP error messages
					//
					if (responseText.contains('{')) {

						// response is in JSON format
						//
						var responseJSON = JSON.parse(responseText); 
						if ((responseJSON !== null) && 
							(responseJSON.error !== null) &&
							(responseJSON.error.message !== null)) {

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
					}

					// show notification
					//
					application.notify({
						message: "Could not save password changes" + (responseText? ' because "' + responseText + '"' : '') + "."
					});
				}
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			this.showChildView('form', new ChangePasswordFormView({
				model: this.model
			}));
		},

		//
		// event handling methods
		//

		onClickSubmit: function() {

			// check validation
			//
			if (this.getChildView('form').isValid()) {
				this.changePassword(this.getChildView('form').getValue('current_password'), 
					this.getChildView('form').getValue('new_password'));
			}
		}
	});
});
