/******************************************************************************\
|                                                                              |
|                        request-username-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is used to request a username.         |
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
	'bootstrap/popover',
	'text!templates/users/authentication/dialogs/request-username-dialog.tpl',
	'models/users/user',
	'views/dialogs/dialog-view',
], function($, _, Popover, Template, User, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #request-username': 'onClickRequestUsername',
			'click #cancel': 'onClickCancel'
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
					application.notify({
						message: "If the email address you submitted matches a valid account, an email containing your username will be sent."
					});
				},
		
				error: function(jqXHR) {

					// show error message
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

				// show notification message
				//
				application.notify({
					message: "You must supply a user name or email address."
				});
			}

			if (this.options.accept){
				this.options.accept();
			}

			// disable default form submission
			//
			return false;
		},

		onClickCancel: function() {
			if (this.options.reject) {
				this.options.reject();
			}
		}
	});
});
