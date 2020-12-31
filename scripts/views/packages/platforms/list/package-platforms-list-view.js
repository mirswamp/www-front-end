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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
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

		// sort by platform column in ascending order 
		//
		sortBy: ['platform', 'ascending'],

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