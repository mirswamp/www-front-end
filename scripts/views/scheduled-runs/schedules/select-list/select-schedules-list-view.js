/******************************************************************************\
|                                                                              |
|                          select-schedules-list-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a selectable list of                |
|        run request schedules.                                                |
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
	'text!templates/scheduled-runs/schedules/select-list/select-schedules-list.tpl',
	'views/widgets/lists/table-list-view',
	'views/scheduled-runs/schedules/select-list/select-schedules-list-item-view'
], function($, _, Backbone, Marionette, Template, TableListView, SelectSchedulesListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: SelectSchedulesListItemView,

		//
		// methods
		//

		childViewOptions: function(model, index) {
			return {
				project: this.options.project,
				itemIndex: index,
				selectedAssessmentRunUuids: this.options.selectedAssessmentRunUuids,
				showDelete: this.options.showDelete
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showDelete: this.options.showDelete
			}));
		},

		//
		// querying methods
		//

		getSelected: function() {
			var selectedRadioButton = this.$el.find('input:checked');
			var index = selectedRadioButton.attr('index');
			return this.collection.at(index);
		}
	});
});