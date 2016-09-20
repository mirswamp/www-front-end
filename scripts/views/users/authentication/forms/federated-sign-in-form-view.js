/******************************************************************************\
|                                                                              |
|                          federated-sign-in-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for authenticating users using a federated        |
|        authentication service.                                               |
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
	'text!templates/users/authentication/forms/federated-sign-in-form.tpl',
	'registry',
	'views/users/authentication/selectors/auth-provider-selector-view',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, Popover, Template, Registry, AuthProviderSelectorView, NotifyView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click #federated-signin': 'onClickFederatedSignIn',
			'click #github-signin': 'onClickGitHubSignIn'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				config: Registry.application.config
			}));
		},

		onRender: function() {

			// add federated sign in
			//
			if (Registry.application.config['federated_authentication_enabled']) {

				// add regions
				//
				this.addRegions({
					authProviderSelector: '#auth-provider-selector'
				});

				// show subviews
				//
				this.authProviderSelector.show(
					new AuthProviderSelectorView()
				);
			}

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		//
		// event handling methods
		//

		onClickFederatedSignIn: function() {
			var provider = this.$el.find('#auth-provider-selector select').val();

			if (provider == 'GitHub') {
				require([
					'models/users/session'
				], function (Session) {

					// redirect to github login view
					//
					Session.githubRedirect();
				});
			} else {
				Registry.application.modal.show(
					new NotifyView({
						message: "This identity provider is not yet supported."
					})
				);
			}
		},

		onClickGitHubSignIn: function() {
			require([
				'models/users/session'
			], function (Session) {

				// redirect to github login view
				//
				Session.githubRedirect();
			});
		}
	});
});
