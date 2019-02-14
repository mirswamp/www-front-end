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
	'backbone',
	'marionette',
	'text!templates/tools/list/tools-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/tools/list/tools-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, ToolsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ToolsListItemView,

		sorting: {

			// sort on name column in ascending order 
			//
			sortList: [[0, 0]] 			
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering
			}));
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering
			}
		}
	});
});