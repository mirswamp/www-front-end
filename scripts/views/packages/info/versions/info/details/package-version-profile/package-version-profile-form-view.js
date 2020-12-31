/******************************************************************************\
|                                                                              |
|                     package-version-profile-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a package versions's profile         |
|        info.                                                                 |
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
	'text!templates/packages/info/versions/info/details/package-version-profile/package-version-profile-form.tpl',
	'views/forms/form-view'
], function($, _, Template, FormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				package: this.options.package
			};
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.validate({

				// callbacks
				//
				highlight: function(element) {
					$(element).closest('.control-group').removeClass('success').addClass('error');
				},

				success: function(element) {
					element
					.text('OK!').addClass('valid')
					.closest('.control-group').removeClass('error').addClass('success');
				}
			});
		},

		//
		// form methods
		//

		getValues: function() {

			// get values from form
			//
			var checkoutArgument = this.$el.find('#checkout-argument input').val();
			var versionString = this.$el.find('#version-string').val();
			var notes = this.$el.find('#notes').val();

			return {
				'checkout_argument': checkoutArgument != ''? checkoutArgument : null,
				'version_string': versionString != ''? versionString : null,
				'notes': notes != ''? notes : null
			};
		},
	});
});
