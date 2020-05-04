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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
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

		// sort by package column in descending order 
		//
		sortBy: ['date', 'descending'],

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
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
				showDelete: this.options.showDelete
			};
		}
	});
});
