/******************************************************************************\
|                                                                              |
|                      linked-account-registration-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the introductory view of the application.                |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'text!templates/users/registration/linked-accounts/linked-account-registration.tpl',
	'text!templates/policies/acceptable-use-policy.tpl',
	'text!templates/policies/linked-account-policy.tpl',
	'views/base-view',
	'utilities/security/password-policy',
	'utilities/web/query-strings',
], function($, _, Config, Template, AcceptableUsePolicy, LinkedAccountPolicy, BaseView, PasswordPolicy) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #next': 'onClickNext',
			'click #cancel': 'onClickCancel'
		},

		//
		// querying methods
		//

		isValid: function() {
			return this.$el.find('input').is(':checked');
		},

		getProviderName: function() {
			if (this.options.provider == 'cilogon') {
				return decodeURI(getQueryStringValue(getQueryString(), 'name'));
			} else {
				return this.options.provider.toTitleCase();
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				acceptable_use_policy: AcceptableUsePolicy,
				linked_account_policy: _.template(LinkedAccountPolicy, {
					passwordPolicy: passwordPolicy
				})(),
				provider: this.getProviderName()
			};
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickNext: function() {

			// check validation
			//
			if (this.isValid()) {

				// sign up using provider
				//
				window.location = Config.servers.web + '/providers/' + this.options.provider + '/register' + (hasQueryString()? '?' + getQueryString() : '');
			} else {

				// display error message
				//
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to home view
			//
			Backbone.history.navigate('#home', {
				trigger: true
			});
		}
	});
});
