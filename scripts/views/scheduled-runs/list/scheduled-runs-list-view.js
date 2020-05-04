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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/scheduled-runs/list/scheduled-runs-list.tpl',
	'views/base-view',
	'views/collections/tables/groupable-table-list-view',
	'views/scheduled-runs/list/scheduled-runs-list-item-view'
], function($, _, Template, BaseView, GroupableTableListView, ScheduledRunsListItemView) {
	return GroupableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ScheduledRunsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No scheduled runs.")
		}),

		// sort by package column in ascending order 
		//
		sortBy: ['package', 'ascending'],
		groupExcept: ['schedule', 'delete'],

		//
		// constructor
		//

		initialize: function(options) {
			this.options.showSchedule = this.model == undefined;

			// call superclass method
			//
			GroupableTableListView.prototype.initialize.call(this, options);
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

				// options
				//
				showProjects: this.options.showProjects,
				showSchedule: this.options.showSchedule,
				showGrouping: this.options.showGrouping,
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

				// options
				//
				showProjects: this.options.showProjects,
				showSchedule: this.options.showSchedule,
				showGrouping: this.options.showGrouping,
				showDelete: this.options.showDelete,
				parent: this,

				// callbacks
				//
				onDelete: this.options.onDelete
			};
		}
	});
});