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
	'text!templates/users/registration/dialogs/sign-up-dialog.tpl',
	'config',
	'views/dialogs/dialog-view'
], function($, _, Popover, Template, Config, DialogView) {
	'use strict';

	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #google-sign-up': 'onClickGoogleSignUp',
			'click #github-sign-up': 'onClickGitHubSignUp',
			'click #other-sign-up': 'onClickOtherSignUp',
			'click #sign-up': 'onClickSignUp',
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

		templateContext: function() {
			return {
				show_google: application.config.google_authentication_enabled,
				show_github: application.config.github_authentication_enabled,
				show_other: application.config.ci_logon_authentication_enabled
			};
		},

		showSignInWithDialog: function() {
			var self = this;
			require([
				'collections/users/user-classes',
				'views/users/registration/linked-accounts/dialogs/sign-up-with-dialog-view'
			], function(UserClasses, SignUpWithDialogView) {

				// fetch user classes
				//
				new UserClasses().fetch({

					// callbacks
					//
					success: function(collection) {

						// show add sign in with dialog
						//
						application.show(new SignUpWithDialogView({
							collection: self.collection,
							classes: collection
						}));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch user classes."
						});
					}
				});
			});
		},

		//
		// mouse event handling methods
		//

		onClickGoogleSignUp: function() {
			Backbone.history.navigate('#providers/google/register', {
				trigger: true
			});
		},

		onClickGitHubSignUp: function() {
			Backbone.history.navigate('#providers/github/register', {
				trigger: true
			});
		},

		onClickOtherSignUp: function() {
			this.showSignInWithDialog();
		},

		onClickSignUp: function() {
			Backbone.history.navigate('#register', {
				trigger: true
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
