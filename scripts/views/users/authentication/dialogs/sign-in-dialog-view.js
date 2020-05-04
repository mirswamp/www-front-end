/******************************************************************************\
|                                                                              |
|                             sign-in-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        modal sign in dialog box.                                             |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/popover',
	'text!templates/users/authentication/dialogs/sign-in-dialog.tpl',
	'views/dialogs/dialog-view',
	'views/users/authentication/forms/sign-in-form-view',
	'views/users/authentication/linked-accounts/forms/linked-account-sign-in-form-view'
], function($, _, Popover, Template, DialogView, SignInFormView, LinkedAccountSignInFormView) {
	'use strict';

	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '.modal-body'
		},

		events: {
			'click #ok': 'onClickOk',
			'click .alert .close': 'onClickAlertClose',
			'keypress': 'onKeyPress'
		},

		//
		// constructor
		//

		initialize: function() {
			this.constructor.dialog = this;
		},

		//
		// rendering methods
		//

		onRender: function() {

			// show child views
			//
			if (!application.config.linked_accounts_enabled) {
				this.showChildView('form', new SignInFormView());
			} else {
				this.showChildView('form', new LinkedAccountSignInFormView());
			}
		},

		//
		// methods
		//

		showHome: function() {

			// remove event handlers
			//
			this.undelegateEvents();

			// go to home view
			//
			Backbone.history.navigate('#home', {
				trigger: true
			});
		},

		//
		// event handling methods
		//

		onSignIn: function() {
			var self = this;
			
			// get user information
			//
			application.session.getUser({
				success: function(user) {
					application.session.user = user;
					self.showHome();
				}
			});

			// close modal dialog
			//
			this.hide();
		},

		//
		// mouse event handling methods
		//

		onClickOk: function() {
			var self = this;
			this.getChildView('form').submit({

				// callbacks
				//
				success: function() {
					self.onSignIn();
				}
			});
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {
				this.onClickOk();
			}
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			this.constructor.dialog = undefined;
		}
	});
});
