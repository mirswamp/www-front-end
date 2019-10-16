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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/review/review-packages-list/review-packages-list.tpl',
	'views/packages/list/packages-list-view',
	'views/packages/review/review-packages-list/review-packages-list-item-view'
], function($, _, Template, PackagesListView, ReviewPackagesListItemView) {
	return PackagesListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
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

		templateContext: function() {
			return {
				collection: this.collection,
				showNumbering: this.options.showNumbering,
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
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			};
		}
	});
});
