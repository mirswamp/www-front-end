/******************************************************************************\
|                                                                              |
|                          schedule-profile-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a schedule's profile            |
|        information.                                                          |
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
	'backbone',
	'marionette',
	'jquery.validate',
	'bootstrap/tooltip',
	'bootstrap/popover',
	'text!templates/scheduled-runs/schedules/profile/schedule-profile-form.tpl'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// methods
		//

		initialize: function() {
			var self = this;

			// add unique name validation rule
			//
			$.validator.addMethod('uniqueName', function (value) { 
				return (value === self.model.get('name')) || self.collection.findRunRequestsByName(value).length === 0;
			}, 'The schedule name must be unique within a project.');
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
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({
				rules: {
					'name': {
						required: true,
						uniqueName: true
					},
					'description': {
						required: true
					}
				},
				messages: {
					'description': {
						required: "Please provide a short description of this schedule."
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// form methods
		//

		update: function(model) {

			// get values from form
			//
			var name = this.$el.find('#name').val();
			var description = this.$el.find('#description').val();

			// update model
			//
			model.set({
				'name': name,
				'description': description
			});
		}
	});
});