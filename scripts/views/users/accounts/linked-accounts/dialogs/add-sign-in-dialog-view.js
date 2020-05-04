/******************************************************************************\
|                                                                              |
|                           add-sign-in-dialog-view.js                         |
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
	'text!templates/users/accounts/linked-accounts/dialogs/add-sign-in-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Popover, Template, DialogView) {
	'use strict';

	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #google-sign-in': 'onClickGoogleSignIn',
			'click #github-sign-in': 'onClickGithubSignIn',
			'click #other-sign-in': 'onClickOtherSignIn',
		},

		//
		// querying methods
		//

		hasProviderNamed: function(name) {
			return this.collection.hasItemNamed(name);
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				show_google: application.config.google_authentication_enabled && !this.hasProviderNamed('Google'),
				show_github: application.config.github_authentication_enabled && !this.hasProviderNamed('GitHub'),
				show_other: application.config.ci_logon_authentication_enabled
			};
		},

		//
		// mouse event handling methods
		//

		onClickGoogleSignIn: function() {

			// link account from identity provider
			//
			Backbone.history.navigate('#providers/google/sign-in/add', {
				trigger: true
			});
		},

		onClickGithubSignIn: function() {

			// link account from identity provider
			//
			Backbone.history.navigate('#providers/github/sign-in/add', {
				trigger: true
			});
		},

		onClickOtherSignIn: function() {
			var self = this;
			require([
				'views/users/accounts/linked-accounts/dialogs/add-sign-in-with-dialog-view'
			], function(AddSignInWithDialogView) {

				// show add sign in with dialog
				//
				application.show(new AddSignInWithDialogView({
					collection: self.collection
				}));
			});
		}
	});
});
