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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/admin/status/item-list/item-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/admin/status/item-list/item-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, ItemListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ItemListItemView,

		emptyView: BaseView.extend({
			template: _.template("No items.")
		}),

		//
		// constructor
		//

		initialize: function(options) {

			// call superclass constructor
			//
			SortableTableListView.prototype.initialize.call(this, options);	

			// if no sort order is specified, then 
			// sort by first column in ascending order.
			//
			if (!this.sortBy) {
				this.sortBy = [this.options.fieldnames[0], 'ascending'];
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				fieldnames: this.options.fieldnames
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
				fieldnames: this.options.fieldnames
			};
		}
	});
});
