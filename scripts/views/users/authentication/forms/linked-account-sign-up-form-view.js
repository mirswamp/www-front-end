/******************************************************************************\
|                                                                              |
|                          federated-sign-up-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for signing up users using a federated            |
|        authentication service.                                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/popover',
	'text!templates/users/authentication/forms/linked-account-sign-up-form.tpl',
	'registry',
	'views/users/authentication/selectors/auth-provider-selector-view',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, Popover, Template, Registry, AuthProviderSelectorView, NotifyView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click #linked-account-signup': 'onClickLinkedAccountSignUp'
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

			// add linked account sign in
			//
			if (Registry.application.config['linked_accounts_enabled']) {

				// add regions
				//
				this.addRegions({
					linkedAccountSelector: '#linked-account-selector'
				});

				// show subviews
				//
				this.linkedAccountSelector.show(
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

		onClickLinkedAccountSignUp: function() {
			var provider = this.$el.find('#linked-account-selector select').val();

			require([
				'models/users/session'
			], function (Session) {

				// redirect to login view
				//
				Session.linkedAccountRedirect(provider);
			});
		}
	});
});
