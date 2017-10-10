/******************************************************************************\
|                                                                              |
|                                 run-queue-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a queue of running jobs.           |
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
	'text!templates/admin/status/run-queue/run-queue.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/admin/status/run-queue/run-queue-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, RunQueueItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: RunQueueItemView,

		sorting: {

			// sort on submitted column in descending order 
			//
			sortList: [[0, 1]]
		},

		//
		// constructor
		//

		initialize: function() {

			// allow sort order to be passed in
			//
			if (this.options.sortList) {
				this.sorting.sortList = this.options.sortList;
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			if (this.collection.length > 0) {
				return _.template(Template, _.extend(data, {
					collection: this.collection,
					showNumbering: this.options.showNumbering
				}));
			} else {
				return _.template("No jobs are currently running.")
			}
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				showNumbering: this.options.showNumbering
			}
		}
	});
});