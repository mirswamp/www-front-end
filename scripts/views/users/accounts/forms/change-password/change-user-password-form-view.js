/******************************************************************************\
|                                                                              |
|                      change-user-password-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for changing a user's password.                   |
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
	'text!templates/users/accounts/forms/change-password/change-user-password-form.tpl',
	'views/forms/form-view',
	'utilities/security/password-policy'
], function($, _, Template, FormView, PasswordPolicy) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			"click .alert .close": "onClickAlertClose",
			"keydown #password": "onKeydownPassword"
		},

		//
		// form attributes
		//

		rules: {
			"password": {
				required: true,
				passwordValid: true
			},
			"confirm-password": {
				required: true,
				equalTo: ".new-password input"
			}
		},

		messages: {
			"password": {
				required: "Enter a password."
			},
			"confirm-password": {
				required: "Re-enter your password.",
				equalTo: "Enter the same password as above."
			}
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;
			
			// add password validation rule
			//
			$.validator.addMethod("passwordValid", function(value) {
				var username = application.session.user.get('username');
				var passwordRating = $.validator.passwordRating(value, username);
				return (passwordRating.messageKey === "strong");
			}, "Your password does not meet the required criteria.");
		},

		//
		// form querying methods
		//

		getValue: function(kind) {
			switch (kind) {
				case 'new_password':
					return this.$el.find(".new-password input").val();
				case 'confirm_password':
					return this.$el.find(".confirm-password input").val();
			}
		},

		getValues: function() {
			return {
				new_password: this.getValue('new_password'),
				confirm_password: this.getValue('confirm_password')
			};
		},

		isValid: function() {

			// check validation
			//
			if (FormView.prototype.isValid.call(this)) {

	 			// confirm password spelling
				//
				if (this.getValue('new_password') !== this.getValue('confirm_password')) {
					this.$el.find(".alert").show("Passwords do not match. ");
					return false;
				} else {
					return true;
				}
			} else {

				// display error message
				//
				this.showWarning();
			}

			return false;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				passwordPolicy: PasswordPolicy
			};
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

		onClickAlertClose: function() {
			this.hideWarning();
		},

		//
		// keyboard event handling methods
		//

		onKeydownPassword: function(event) {
			var maxlength = $(event.currentTarget).attr("maxlength");
			if (maxlength) {
				var length = event.currentTarget.value.length;
				if (length >= maxlength) {

					// show password length notification message
					//
					application.notify({
						message: "Your password may not exceed " + maxlength + " characters in length."
					});
				}
			}
		}
	});
});
