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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/tools/review/review-tools-list/review-tools-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/tools/review/review-tools-list/review-tools-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, ReviewToolsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ReviewToolsListItemView,

		sorting: {

			// disable sorting on delete column
			//
			headers: { 
				4: { 
					sorter: false 
				}
			},

			// sort on date column in descending order 
			//
			sortList: [[3, 1]]
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showDeactivatedTools: this.options.showDeactivatedTools,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				showDeactivatedTools: this.options.showDeactivatedTools,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}
		}
	});
});