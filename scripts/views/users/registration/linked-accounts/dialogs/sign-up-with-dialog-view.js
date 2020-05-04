/******************************************************************************\
|                                                                              |
|                          sign-up-with-dialog-view.js                         |
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
	'text!templates/users/registration/linked-accounts/dialogs/sign-up-with-dialog.tpl',
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
			'change #class-code': 'onChangeClassCode',
			'click #ok': 'onClickOk',
			'keypress': 'onKeyPress'
		},

		//
		// querying methods
		//

		getProvider: function() {
			return this.getChildView('selector').getSelected();
		},

		getSelectedIndex: function() {
			var classSelector = this.$el.find('#class-code')[0];
			if (classSelector) {
				return classSelector.selectedIndex;
			}
		},

		//
		// methods
		//

		signUpWith: function(provider, options) {

			// set query string
			//
			var queryString = 'entityid=' + urlEncode(provider.get('entityid')) + 
				'&name=' + urlEncode(provider.get('name'));
			if (options && options.class) {
				queryString += '&class_code=' + options.class.get('class_code');
			}

			// link account from identity provider
			//
			Backbone.history.navigate('#providers/cilogon/register' + '?' + queryString, {
				trigger: true
			});

			this.hide();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.options.classes
			};
		},

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


		onChangeClassCode: function() {

			// hide / show alert info
			//
			var classCode = this.$el.find('#class-code').val();
			if (classCode != 'none') {
				this.$el.find('.alert-info').show();
			} else {
				this.$el.find('.alert-info').hide();
			}
		},

		onClickOk: function() {
			var provider = this.getProvider();
			if (provider) {

				// get class index
				//
				var index = this.getSelectedIndex();

				// save name of auth provider for later
				//
				application.options.authProvider = provider.get('name');
				application.saveOptions();

				// sign up with or without class
				//
				if (index) {
					this.signUpWith(provider, {
						class: this.options.classes.at(index - 1)
					});
				} else {
					this.signUpWith(provider);	
				}
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
