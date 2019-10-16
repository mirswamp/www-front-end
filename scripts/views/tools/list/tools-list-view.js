/******************************************************************************\
|                                                                              |
|                                tools-list-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of tools.                   |
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
	'text!templates/tools/list/tools-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/tools/list/tools-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, ToolsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ToolsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No tools.")
		}),

		sorting: {

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