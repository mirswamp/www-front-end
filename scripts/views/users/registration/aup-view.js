/******************************************************************************\
|                                                                              |
|                                    aup-view.js                               |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'validate',
	'text!templates/users/registration/aup.tpl',
	'text!templates/policies/acceptable-use-policy.tpl',
	'registry',
	'views/users/registration/user-registration-view',
], function($, _, Backbone, Marionette, Validate, Template, AupTemplate, Registry, UserRegistrationView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			aupText: '#aup-text'
		},

		template: _.template(Template),

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #submit': 'onClickSubmit',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		onRender: function() {

			// show subview
			//
			this.$el.find('#aup-text').html(_.template(AupTemplate));

			// validate form
			//
			this.validator = this.validate();

			// scroll to top
			//
			var el = this.$el.find('h1');
			el[0].scrollIntoView(true);
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

		onClickSubmit: function() {
			var self = this;

			// check validation
			//
			if (this.isValid()) {
				self.undelegateEvents();

				if( self.options && self.options.accept ){
					self.options.accept();
				} else {

					// show next view
					//
					Registry.application.showMain(
						new UserRegistrationView({})
					);
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
