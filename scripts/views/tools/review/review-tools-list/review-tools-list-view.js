/******************************************************************************\
|                                                                              |
|                           review-tools-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of tools for review.        |
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
	'text!templates/tools/review/review-tools-list/review-tools-list.tpl',
	'views/tools/list/tools-list-view',
	'views/tools/review/review-tools-list/review-tools-list-item-view'
], function($, _, Template, ToolsListView, ReviewToolsListItemView) {
	return ToolsListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ReviewToolsListItemView,

		// sort by date column in descending order 
		//
		sortBy: ['date', 'descending'],

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,

				// options
				//
				showDeactivatedTools: this.options.showDeactivatedTools,
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
				showDeactivatedTools: this.options.showDeactivatedTools,
				showDelete: this.options.showDelete
			};
		}
	});
});