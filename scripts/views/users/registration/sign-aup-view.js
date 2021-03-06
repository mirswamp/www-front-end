/******************************************************************************\
|                                                                              |
|                                  sign-aup-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the acceptable use policy view used in the new           |
|        user registration process.                                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'jquery.validate',
	'text!templates/users/registration/sign-aup.tpl',
	'text!templates/policies/acceptable-use-policy.tpl',
	'views/base-view',
	'views/users/registration/user-registration-view',
], function($, _, Validate, Template, AupTemplate, BaseView, UserRegistrationView) {
	return BaseView.extend({

		//
		// attributes
		//

		regions: {
			form: "#linked-account-sign-up-form"
		},

		template: _.template(Template),

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #aup-form input': 'onClickCheckbox',
			'click #register': 'onClickRegister',
			'click #cancel': 'onClickCancel'
		},

		//
		// form attributes
		//

		rules: {
			'accept': {
				required: true
			}
		},

		messages: {
			'accept': {
				required: "You must accept the terms to continue."
			}
		},

		//
		// rendering methods
		//

		onRender: function() {

			// validate form
			//
			this.validator = this.validate();

			// show subviews
			//
			this.$el.find('#aup-text').html(_.template(AupTemplate));
			this.showSignUpView();

			// scroll to top
			//
			var el = this.$el.find('h1');
			el[0].scrollIntoView(true);
		},

		showSignUpView: function() {
			var self = this;
			require([
				'views/users/registration/forms/linked-account-sign-up-form-view'
			], function (LinkedAccountSignUpFormView) {

				// show sign up form
				//
				self.showChildView('form', new LinkedAccountSignUpFormView());
			});
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
			return this.$el.find('#aup-form').validate({
				rules: this.rules,
				messages: this.messages
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

		onClickCheckbox: function(event) {
			if ($(event.target).is(':checked')) {

				// enable registration
				//
				this.$el.find('#register').prop('disabled', false);
			} else {

				// disable registration
				//
				this.$el.find('#register').prop('disabled', true);
			}
		},

		onClickRegister: function() {
			var self = this;

			// check validation
			//
			if (this.isValid()) {
				self.undelegateEvents();

				if (self.options && self.options.accept) {
					self.options.accept();
				} else {

					// show next view
					//
					application.showMain(new UserRegistrationView({}));
				}
			} else {
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to home view
			//
			application.navigate('#home');
		}
	});
});
