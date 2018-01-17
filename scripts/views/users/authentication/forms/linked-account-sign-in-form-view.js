/******************************************************************************\
|                                                                              |
|                      linked-account-sign-in-form-view.js                     |
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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/popover',
	'text!templates/users/authentication/forms/linked-account-sign-in-form.tpl',
	'registry',
	'views/users/authentication/selectors/auth-provider-selector-view',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, Popover, Template, Registry, AuthProviderSelectorView, NotifyView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			authProviderSelector: '#auth-provider-selector'
		},

		events: {
			'click #github-sign-in': 'onClickGitHubSignIn',
			'click #google-sign-in': 'onClickGoogleSignIn',
			'click #select-sign-in': 'onClickSelectSignIn',
			'click #username-password button': 'onClickUsernamePassword',
		},

		//
		// constructor
		//

		initialize: function() {
			this.useLinkedAccount = Registry.application.options.authProvider != undefined;
		},

		//
		// form methods
		//

		getProvider: function() {
			return this.authProviderSelector.currentView.providers.findWhere({
				name: this.$el.find('#auth-provider-selector select').val()
			});
		},

		submit: function() {
			var provider = this.getProvider();

			// save name of auth provider for later
			//
			Registry.application.options.authProvider = provider.get('name');
			Registry.application.saveOptions();
			
			require([
				'models/users/session'
			], function (Session) {

				// redirect to linked account
				//
				Session.linkedAccountRedirect(provider);
			});
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

			// show provider selector
			//
			if (Registry.application.config['linked_accounts_enabled']) {
				this.showAuthProviderSelector();
			}

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		showAuthProviderSelector: function() {
			var self = this;
			this.authProviderSelector.show(
				new AuthProviderSelectorView({		

					// callback
					//
					onChange: function() {
						self.selectedProvider = self.authProviderSelector.currentView.selected;
						self.onSelect();
					}
				})
			);
		},

		showProviders: function() {
			this.useLinkedAccount = true;

			// perform callback
			//
			if (this.options.onShowProviders) {
				this.showingProviders = true;
				this.options.onShowProviders();
			}
		},

		showUsernamePassword: function() {
			this.useLinkedAccount = false;

			// perform callback
			//
			if (this.options.onHideProviders) {
				this.showingProviders = false;
				this.options.onHideProviders();
			}
		},

		//
		// form validation methods
		//

		isValid: function() {
			return this.showingProviders;
		},

		//
		// event handling methods
		//

		onSelect: function() {
			if (this.options.onSelect) {
				this.options.onSelect();
			}
		},
		
		onClickGitHubSignIn: function(event) {

			// get provider
			//
			var provider = this.authProviderSelector.currentView.providers.findWhere({
				name: 'GitHub'
			});

			require([
				'models/users/session'
			], function (Session) {

				// redirect to linked account
				//
				Session.linkedAccountRedirect(provider);
			});

			// prevent default event handling
			//
			event.stopPropagation();
			event.preventDefault();
		},

		onClickGoogleSignIn: function(event) {

			// get provider
			//
			var provider = this.authProviderSelector.currentView.providers.findWhere({
				name: 'Google'
			});

			require([
				'models/users/session'
			], function (Session) {

				// redirect to linked account
				//
				Session.linkedAccountRedirect(provider);
			});

			// prevent default event handling
			//
			event.stopPropagation();
			event.preventDefault();
		},

		onClickSelectSignIn: function(event) {
			this.showProviders();

			// prevent default event handling
			//
			event.stopPropagation();
			event.preventDefault();
		},

		onClickUsernamePassword: function() {
			this.showUsernamePassword();

			// prevent default event handling
			//
			event.stopPropagation();
			event.preventDefault();
		}
	});
});
