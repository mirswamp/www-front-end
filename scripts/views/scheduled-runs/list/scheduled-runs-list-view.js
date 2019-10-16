/******************************************************************************\
|                                                                              |
|                            scheduled-runs-list-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a list of scheduled runs.           |
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
	'text!templates/scheduled-runs/list/scheduled-runs-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/scheduled-runs/list/scheduled-runs-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, ScheduledRunsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ScheduledRunsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No scheduled runs.")
		}),

		sorting: {

			// disable sorting on delete column
			//
			headers: {
				3: { 
					sorter: false 
				}
			},

			// sort on package column in descending order 
			//
			sortList: [[0, 0]]
		},

		//
		// constructor
		//

		initialize: function(options) {
			this.options.showSchedule = this.model == undefined;

			// call superclass method
			//
			SortableTableListView.prototype.initialize.call(this, options);
		},

		//
		// querying methods
		//

		getRunRequestUrl: function() {
			if (this.model && this.model.get('project_uuid') != null) {
				return '#run-requests/schedules/' + this.model.get('run_request_uuid');
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				runRequestUrl: this.getRunRequestUrl(),
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				showSchedule: this.options.showSchedule,
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
				collection: this.collection,
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				showSchedule: this.options.showSchedule,
				showDelete: this.options.showDelete,
				onDelete: this.options.onDelete,
				parent: this
			};
		}
	});
});