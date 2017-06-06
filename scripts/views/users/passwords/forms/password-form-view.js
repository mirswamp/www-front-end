/******************************************************************************\
|                                                                              |
|                            password-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for editing application passwords.                |
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
	'validate',
	'popover',
	'text!templates/users/passwords/forms/password-form.tpl'
], function($, _, Backbone, Marionette, Validate, Popover, Template) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'input input': 'onChange'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// validate the form
			//
			this.validator = this.validate();
		},

		//
		// form methods
		//

		update: function(model) {

			// set model attributes
			//
			this.model.set({
				'label': this.$el.find('#password-label input').val()
			});
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate();
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// event handling methods
		//

		onChange: function() {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		}
	});
});
