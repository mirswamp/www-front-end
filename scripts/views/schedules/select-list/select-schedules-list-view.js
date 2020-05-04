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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/schedules/select-list/select-schedules-list.tpl',
	'views/collections/tables/sortable-table-list-view',
	'views/schedules/select-list/select-schedules-list-item-view'
], function($, _, Template, SortableTableListView, SelectSchedulesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		childView: SelectSchedulesListItemView,

		// sort by schedule column in ascending order 
		//
		sortBy: ['schedule', 'ascending'],

		//
		// methods
		//

		childViewOptions: function(model) {

			// check if empty view
			//
			if (!model) {
				return {};
			}

			// return view options
			//
			return {
				project: this.options.project,
				itemIndex: this.collection.indexOf(model),
				selectedAssessmentRunUuids: this.options.selectedAssessmentRunUuids,
				showProjects: this.options.showProjects,
				showDelete: this.options.showDelete
			};
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showProjects: this.options.showProjects,
				showDelete: this.options.showDelete
			};
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