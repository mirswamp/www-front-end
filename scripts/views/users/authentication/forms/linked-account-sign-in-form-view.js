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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'popover',
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
			'click #sign-in-with button': 'onClickSignInWith',
			'click #username-password button': 'onClickUsernamePassword',
		},

		submit: function() {

			// get provider
			//
			var provider = this.authProviderSelector.currentView.providers.findWhere({
				name: this.$el.find('#auth-provider-selector select').val()
			});
			
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
						var selected = self.linkedAccountSelector.currentView.selected;
						if (selected) {

							// use linked account login
							//
							self.hideUsernamePassword();
						} else {

							// use username / password
							//
							self.showUsernamePassword();
						}
					}
				})
			);
		},

		//
		// event handling methods
		//

		onClickSignInWith: function() {
			this.useLinkedAccount = true;
			if (this.options.onSelect) {
				this.options.onSelect();
			}
		},

		onClickUsernamePassword: function() {
			this.useLinkedAccount = false;
			if (this.options.onDeselect) {
				this.options.onDeselect();
			}
		}
	});
});
