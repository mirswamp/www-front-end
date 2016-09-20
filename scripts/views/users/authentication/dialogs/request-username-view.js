/******************************************************************************\
|                                                                              |
|                            request-username-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog box that is used to request a username.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'popover',
	'text!templates/users/authentication/dialogs/request-username.tpl',
	'registry',
	'models/users/user',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Popover, Template, Registry, User, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

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
					Registry.application.modal.show(
						new NotifyView({
							message: "If the email address you submitted matches a valid account, an email containing your username will be sent."
						})
					);
				},
		
				error: function(jqXHR) {
					Registry.application.modal.show(
						new ErrorView({
							message: jqXHR.responseText
						})
					);
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

				// show notification dialog
				//
				Registry.application.modal.show(
					new NotifyView({
						message: "You must supply a user name or email address."
					})
				);
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
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {
				this.onClickResetPassword();
				Registry.application.modal.hide();
			}
		}
	});
});
