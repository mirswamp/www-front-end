/******************************************************************************\
|                                                                              |
|                          package-platforms-list-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of package platforms.       |
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
	'text!templates/packages/platforms/list/package-platforms-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/packages/platforms/list/package-platforms-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, PackagePlatformsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: PackagePlatformsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No package platforms.")
		}),

		sorting: {

			// disable sorting on delete column
			//
			headers: {
				4: { 
					sorter: false 
				}
			},

			// sort on name column in ascending order 
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