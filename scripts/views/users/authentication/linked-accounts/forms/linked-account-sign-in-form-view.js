/******************************************************************************\
|                                                                              |
|                     linked-account-sign-in-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view used for user authentication.                |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'text!templates/users/authentication/linked-accounts/forms/linked-account-sign-in-form.tpl',
	'views/users/authentication/forms/sign-in-form-view'
], function($, _, Config, Template, SignInFormView) {
	'use strict';

	return SignInFormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: _.extend({}, SignInFormView.prototype.events, {
			'click #google-sign-in': 'onClickGoogleSignIn',
			'click #github-sign-in': 'onClickGitHubSignIn',
			'click #other-sign-in': 'onClickOtherSignIn'
		}),

		//
		// methods
		//

		signInWith: function(provider) {

			// redirect to third party sign in
			//
			window.location = Config.servers.web + '/providers/' + provider + '/login';
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

		//
		// dialog rendering methods
		//

		showSignInWithDialog: function() {
			require([
				'views/users/authentication/linked-accounts/dialogs/sign-in-with-dialog-view'
			], function (SignInWithDialogView) {

				// show sign in with dialog
				//
				application.show(new SignInWithDialogView());
			});
		},

		//
		// mouse event handling methods
		//

		onClickGoogleSignIn: function() {
			this.signInWith('google');
		},
		
		onClickGitHubSignIn: function() {
			this.signInWith('github');
		},

		onClickOtherSignIn: function() {
			this.showSignInWithDialog();
		}
	});
});
