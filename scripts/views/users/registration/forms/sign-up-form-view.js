/******************************************************************************\
|                                                                              |
|                               sign-up-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for authenticating (signing up) users.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/popover',
	'text!templates/users/registration/forms/sign-up-form.tpl',
	'config',
	'registry',
	'views/users/registration/forms/linked-account-sign-up-form-view'
], function($, _, Backbone, Marionette, Popover, Template, Config, Registry, LinkedAccountSignUpFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		className: 'form-horizontal',

		regions: {
			linkedAccountSignUpForm: '#linked-account-sign-up-form'
		},

		events: {
			'click #register': 'onClickRegister'
		},

		//
		// rendering methods
		//

		template: function(){
			return _.template(Template, {
				config: Registry.application.config
			});
		},

		onRender: function() {

			// add linked account sign up
			//
			this.showLinkedAccountSignUp();

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

		},

		showLinkedAccountSignUp: function() {

			// show subviews
			//
			this.linkedAccountSignUpForm.show(
				new LinkedAccountSignUpFormView()
			);
		},

		//
		// event handling methods
		//

		onClickRegister: function() {

			// dismiss dialog 
			//
			Registry.application.modal.hide();
			
			// go to regitration view
			//
			Backbone.history.navigate('#register', {
				trigger: true
			});
		}
	});
});
