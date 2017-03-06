/******************************************************************************\
|                                                                              |
|                                  sign-up-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        modal sign in dialog box.                                             |
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
	'popover',
	'text!templates/users/registration/dialogs/sign-up.tpl',
	'registry',
	'views/users/registration/forms/sign-up-form-view'
], function($, _, Backbone, Marionette, Popover, Template, Registry, SignUpFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			signUpForm: "#sign-up-form"
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template);
		},

		onRender: function() {

			// show subviews
			//
			this.signUpForm.show(
				new SignUpFormView()
			);

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		}
	});
});
