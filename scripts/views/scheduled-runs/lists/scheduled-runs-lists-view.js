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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
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
				model: model,
				collection: this.options.scheduledRuns.getByRunRequest(model),
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				showSchedule: this.options.showSchedule,
				showDelete: this.options.showDelete,
				onDelete: this.options.onDelete,
				parent: this
			};
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering
			};
		},
	});
});