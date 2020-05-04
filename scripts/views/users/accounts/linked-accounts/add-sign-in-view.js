/******************************************************************************\
|                                                                              |
|                             add-sign-in-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This view shows error information in the event of a linked            |
|        account error.                                                        |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'text!templates/users/accounts/linked-accounts/add-sign-in.tpl',
	'text!templates/policies/linked-account-policy.tpl',
	'views/forms/form-view',
	'utilities/web/query-strings'
], function($, _, Config, Template, LinkedAccountPolicy, FormView) {
	'use strict';
	
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #add-sign-in': 'onClickAddSignIn',
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
				return getQueryStringValue(getQueryString(), 'name');
			} else {
				return this.options.provider.toTitleCase();
			}
		},

		/*
		getProviderId: function() {
			if (this.options.provider == 'cilogon') {
				return 'cilogon/' + getQueryStringValue(getQueryString(), 'entity');
			} else {
				return this.options.provider;
			}
		},
		*/

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				linked_account_policy: LinkedAccountPolicy,
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

		onClickAddSignIn: function() {

			// check validation
			//
			if (this.isValid()) {

				// add linked account using provider
				//
				window.location = Config.servers.web + '/providers/' + this.options.provider + '/login/add' + (hasQueryString()? '?' + getQueryString() : '');
			} else {

				// display error message
				//
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to home view
			//
			Backbone.history.navigate('#my-account/accounts', {
				trigger: true
			});
		}
	});
});
