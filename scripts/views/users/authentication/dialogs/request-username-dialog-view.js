/******************************************************************************\
|                                                                              |
|                       request-username-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog box that is used to request a username.        |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/popover',
	'text!templates/users/authentication/dialogs/request-username-dialog.tpl',
	'models/users/user',
	'views/dialogs/dialog-view',
], function($, _, Popover, Template, User, DialogView) {
	'use strict';

	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #request-username': 'onClickRequestUsername',
			'click #cancel': 'onClickCancel',
			'keypress': 'onKeyPress'
		},

		//
		// methods
		//

		requestUsernameByEmail: function(email) {
			var user = new User();

			// find user by username
			//
			user.requestUsernameByEmail(email, {

				// callbacks
				//
				success: function() {

					// show notification
					//
					application.notify({
						message: "If the email address you submitted matches a valid account, an email containing your username will be sent."
					});
				},
		
				error: function(jqXHR) {

					// show error
					//
					application.error({
						message: jqXHR.responseText
					});
				}
			});
		},

		//
		// rendering methods
		//

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		//
		// event handling methods
		//

		onClickRequestUsername: function() {

			var email = this.$el.find('#email-address').val();
			if (email) {
				this.requestUsernameByEmail(email);
			} else {

				// show notification
				//
				application.notify({
					message: "You must supply a user name or email address."
				});
			}

			if (this.options.accept){
				this.options.accept();
			}

			// close modal dialog
			//
			this.hide();

			// disable default form submission
			//
			return false;
		},

		onClickCancel: function() {
			if (this.options.reject) {
				this.options.reject();
			}
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {
				this.onClickResetPassword();

				// close modal dialog
				//
				this.dialog.hide();
			}
		}
	});
});
