/******************************************************************************\
|                                                                              |
|                   editable-run-request-schedules-list-view.js                |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/schedules/schedule/editable-run-request-schedule-list/editable-run-request-schedule-list.tpl',
	'views/schedules/schedule/run-request-schedule-list/run-request-schedule-list-view',
	'views/schedules/schedule/editable-run-request-schedule-list/editable-run-request-schedule-list-item-view'
], function($, _, Template, RunRequestScheduleListView, EditableRunRequestScheduleListItemView) {
	return RunRequestScheduleListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: EditableRunRequestScheduleListItemView,

		//
		// constructor
		//

		initialize: function() {
			var self = this;

			// set item remove callback
			//
			this.collection.bind('remove', function() {
				self.render();
			}, this);
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				selectedAssessmentRunUuids: this.options.selectedAssessmentRunUuids,
				showDelete: this.options.showDelete
			};
		},

		childViewOptions: function(model) {

			// check if empty view
			//
			if (!model) {
				return {};
			}

			// return view options
			//
			return {
				indexInCollection: this.collection.indexOf(model),
				showDelete: this.options.showDelete,
				onChange: this.options.onChange
			};
		},

		onRender: function() {

			// call superclass method
			//
			RunRequestScheduleListView.prototype.onRender.call(this);

			// validate form
			//
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
		}
	});
});
