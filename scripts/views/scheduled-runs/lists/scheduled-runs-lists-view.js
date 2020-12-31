/******************************************************************************\
|                                                                              |
|                             scheduled-runs-lists-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for multiple lists of scheduled runs.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'views/base-view',
	'views/collections/collection-view',
	'views/scheduled-runs/lists/scheduled-runs-lists-item-view'
], function($, _, BaseView, CollectionView, ScheduledRunsListsItemView) {
	return CollectionView.extend({

		//
		// attributes
		//

		childView: ScheduledRunsListsItemView,

		emptyView: BaseView.extend({
			className: 'empty-list',
			template: _.template("No scheduled runs.")
		}),

		//
		// querying methods
		//

		getSorting: function() {
			var sorting = [];
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children.findByIndex(i);
				sorting.push(child.getSorting());
			}
			return sorting;
		},

		//
		// methods 
		//

		childViewOptions: function(model) {
			var index = this.collection.indexOf(model);

			// check if empty view
			//
			if (!model) {
				return {};
			}

			// return view options
			//
			return {
				model: model,
				collection: this.options.scheduledRuns.getByRunRequest(model),

				// options
				//
				sortBy: this.options.sortBy? this.options.sortBy[index] : null,
				showProjects: this.options.showProjects,
				showSchedule: this.options.showSchedule,
				showGrouping: this.options.showGrouping,
				showDelete: this.options.showDelete,
				parent: this,

				// callbacks
				//
				onDelete: this.options.onDelete,
			};
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,

				// options
				//
				showProjects: this.options.showProjects
			};
		},
	});
});