/******************************************************************************\
|                                                                              |
|                             sign-up-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering registration info.                   |
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
	'text!templates/users/registration/forms/sign-up-form.tpl',
	'views/forms/form-view',
	'views/users/registration/forms/linked-account-sign-up-form-view'
], function($, _, Template, FormView, LinkedAccountSignUpFormView) {
	return FormView.extend({

		//
		// attributes
		//

		className: 'form-horizontal',

		template: _.template(Template),

		regions: {
			form: '#linked-account-sign-up-form'
		},

		events: {
			'click #register': 'onClickRegister'
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
			this.showChildView('form', new LinkedAccountSignUpFormView());
		},

		//
		// event handling methods
		//

		onClickRegister: function() {
			
			// go to regitration view
			//
			Backbone.history.navigate('#register', {
				trigger: true
			});

			// perform callback
			//
			if (this.options.onClick) {
				this.options.onClick();
			}
		}
	});
});
