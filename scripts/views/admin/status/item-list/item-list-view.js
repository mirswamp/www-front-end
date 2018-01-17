/******************************************************************************\
|                                                                              |
|                                 item-list-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a generic list of named items.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/status/item-list/item-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/admin/status/item-list/item-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, ItemListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ItemListItemView,

		sorting: {

			// sort on submitted column in descending order 
			//
			sortList: [[0, 1]]
		},

		//
		// constructor
		//

		initialize: function(options) {

			// call superclass constructor
			//
			SortableTableListView.prototype.initialize.call(this, options);	

			// allow sort order to be passed in
			//
			if (this.options.sortList) {
				this.sorting.sortList = this.options.sortList;
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			if (this.collection.length > 0) {
				return _.template(Template, _.extend(data, {
					fieldnames: this.options.fieldnames,
					showNumbering: this.options.showNumbering
				}));
			} else {
				return _.template("No items.")
			}
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				fieldnames: this.options.fieldnames,
				showNumbering: this.options.showNumbering
			}
		}
	});
});
