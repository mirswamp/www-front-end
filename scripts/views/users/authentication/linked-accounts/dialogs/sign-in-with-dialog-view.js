/******************************************************************************\
|                                                                              |
|                          sign-in-with-dialog-view.js                         |
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
	'config',
	'bootstrap/popover',
	'text!templates/users/authentication/linked-accounts/dialogs/sign-in-with-dialog.tpl',
	'views/dialogs/dialog-view',
	'views/users/authentication/linked-accounts/selectors/auth-provider-selector-view',
	'utilities/web/url-strings'
], function($, _, Config, Popover, Template, DialogView, AuthProviderSelectorView) {
	'use strict';

	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			selector: '#auth-provider-selector'
		},

		events: {
			'click #ok': 'onClickOk',
			'keypress': 'onKeyPress'
		},

		//
		// querying methods
		//

		getProvider: function() {
			return this.getChildView('selector').getSelected();
		},

		//
		// methods
		//

		signInWith: function(provider) {
			window.location = Config.servers.web + '/providers/cilogon/login' +
				'?entityid=' + urlEncode(provider.get('entityid'));
		},

		//
		// rendering methods
		//

		onRender: function() {

			// show provider selector
			//
			this.showAuthProviderSelector();

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		showAuthProviderSelector: function() {
			var self = this;
			this.showChildView('selector', new AuthProviderSelectorView({		

				// callback
				//
				onChange: function() {
					self.selectedProvider = self.getChildView('selector').selected;
				}
			}));
		},

		//
		// mouse event handling methods
		//

		onClickOk: function() {
			var provider = this.getProvider();
			if (provider) {

				// save name of auth provider for later
				//
				application.options.authProvider = provider.get('name');
				application.saveOptions();

				// sign in with selected provider
				//
				this.signInWith(provider);
			}
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {
				this.onClickOk();
			}
		}
	});
});
