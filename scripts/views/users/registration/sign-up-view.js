/******************************************************************************\
|                                                                              |
|                               sign-up-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This displays the acceptable use policy view used in the new          |
|        user registration process.                                            |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/registration/sign-up.tpl',
	'text!templates/policies/acceptable-use-policy.tpl',
	'views/base-view',
	'views/users/registration/user-registration-view',
], function($, _, Template, AcceptableUsePolicy, BaseView, UserRegistrationView) {
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
		// rendering methods
		//

		templateContext: function() {
			return {
				policy: AcceptableUsePolicy
			};
		},

		onRender: function() {

			// validate form
			//
			this.validator = this.validate();
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// form validation methods
		//

		validate: function() {

			// validate form
			//
			return this.$el.find('form').validate({
				rules: {
					'accept': {
						required: true
					}
				},
				messages: {
					'accept': {
						required: "You must accept the terms to continue."
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickNext: function() {
			var self = this;

			// check validation
			//
			if (this.isValid()) {

				// register
				//
				if (this.options.provider) {

					// link account from identity provider
					//
					Backbone.history.navigate('#register/' + this.options.provider + '/policy', {
						trigger: true
					});
				} else {

					// show registration view
					//
					application.show(new UserRegistrationView());			
				}
			} else {
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
