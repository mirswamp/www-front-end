/******************************************************************************\
|                                                                              |
|                     editable-run-request-schedules-list-view.js              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a list of run request schedules.      |
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
	'text!templates/scheduled-runs/schedules/edit/editable-run-request-schedules-list/editable-run-request-schedules-list.tpl',
	'views/widgets/lists/table-list-view',
	'views/scheduled-runs/schedules/edit/editable-run-request-schedules-list/editable-run-request-schedule-item-view'
], function($, _, Backbone, Marionette, Validate, Template, TableListView, EditableRunRequestScheduleItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: EditableRunRequestScheduleItemView,

		//
		// methods
		//

		initialize: function() {
			var self = this;

			// set item remove callback
			//
			this.collection.bind('remove', function() {
				self.render();
			}, this);

			// Custom validation method for class based rule
			$.validator.addMethod('timeRequired', $.validator.methods.required, "Time Required");

			// add numeric only validation rule
			//
			$.validator.addMethod('dayNumber', function (value) { 
				var regex = new RegExp('^([1-9]|[12]\d|3[0-1]i|10|20|30)+$');
				return regex.test(value);
			}, 'Please only enter numeric day values (1-31)');

			$.validator.addClassRules({
				'time_input': {
					timeRequired: true
				},
				'time_shim': {
					timeRequired: true
				},
				'day-of-the-month': {
					dayNumber: true
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				selectedAssessmentRunUuids: this.options.selectedAssessmentRunUuids,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(model) {
			return {
				indexInCollection: this.collection.indexOf(model),
				showDelete: this.options.showDelete
			};
		},

		onRender: function() {
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({

				// callbacks
				//
				errorPlacement: function (error, element) {
					if (element.parent().hasClass('input-append')) {
						error.insertAfter(element.parent());
					}
					else {
						error.insertAfter(element);
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		}
	});
});
