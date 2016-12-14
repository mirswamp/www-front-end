/******************************************************************************\
|                                                                              |
|                           review-packages-list-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of packages for review.     |
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
	'text!templates/packages/review/review-packages-list/review-packages-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/packages/review/review-packages-list/review-packages-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, ReviewPackagesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ReviewPackagesListItemView,

		sorting: {

			// disable sorting on delete column
			//
			headers: { 
				3: { 
					sorter: false 
				}
			},

			// sort on date column in descending order 
			//
			sortList: [[2, 1]]
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}
		}
	});
});
