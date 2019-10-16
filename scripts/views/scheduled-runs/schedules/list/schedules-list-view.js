/******************************************************************************\
|                                                                              |
|                              schedules-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a project's current list of.        |
|        run request schedules.                                                |
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
	'text!templates/scheduled-runs/schedules/list/schedules-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/scheduled-runs/schedules/list/schedules-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, SchedulesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: SchedulesListItemView,

		emptyView: BaseView.extend({
			template: _.template("No schedules.")
		}),

		sorting: {

			// disable sorting on remove column
			//
			headers: {
				3: { 
					sorter: false 
				}
			}
		},

		//
		// rendering methods
		//

		templateContext: function(data) {
			return {
				collection: this.collection,
				showNumbering: this.options.showNumbering,
				showProjects: this.options.showProjects,
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
				index: this.collection.indexOf(model),
				project: this.options.project,
				selectedAssessmentRunUuids: this.options.selectedAssessmentRunUuids,
				showNumbering: this.options.showNumbering,
				showProjects: this.options.showProjects,
				showDelete: this.options.showDelete
			};
		}
	});
});