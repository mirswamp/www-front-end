/******************************************************************************\
|                                                                              |
|                        schedule-profile-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a schedule's profile info.           |
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
	'text!templates/scheduled-runs/schedules/profile/schedule-profile-form.tpl',
	'views/forms/form-view'
], function($, _, Template, FormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// form attributes
		//

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
		},

		//
		// constructor
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
		// form methods
		//

		getValues: function() {

			// return values from form
			//
			return {
				name: this.$el.find('#name').val(),
				description: this.$el.find('#description').val()
			};
		}
	});
});