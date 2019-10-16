/******************************************************************************\
|                                                                              |
|                      linked-account-sign-up-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering linked account registration info.    |
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
	'text!templates/users/registration/forms/linked-account-sign-up-form.tpl',
	'views/forms/form-view',
	'views/users/authentication/selectors/auth-provider-selector-view',
], function($, _, Template, FormView, AuthProviderSelectorView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #linked-account-signup': 'onClickLinkedAccountSignUp'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				config: application.config
			};
		},

		onRender: function() {

			// add linked account sign in
			//
			if (application.config['linked_accounts_enabled']) {

				// add regions
				//
				this.addRegions({
					selector: '#linked-account-selector'
				});

				// show subviews
				//
				this.getRegion('selector').show(new AuthProviderSelectorView());
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
			var provider = this.getChildView('selector').providers.findWhere({
				name: this.$el.find('#linked-account-selector select').val()
			});

			require([
				'models/users/session'
			], function (Session) {

				// redirect to linked account
				//
				Session.linkedAccountRedirect(provider);
			});
		}
	});
});
