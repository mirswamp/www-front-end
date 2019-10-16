/******************************************************************************\
|                                                                              |
|                               platforms-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of platforms.               |
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
	'text!templates/platforms/list/platforms-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/platforms/list/platforms-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, PlatformsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: PlatformsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No platforms.")
		}),

		sorting: {

			// sort on date column in descending order 
			//
			sortList: [[0, 0]] 	
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering
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
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering
			};
		}
	});
});