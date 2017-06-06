/******************************************************************************\
|                                                                              |
|                                 fields-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of api data type fields.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/api/types/fields-list/fields-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/api/types/fields-list/fields-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, FieldsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: FieldsListItemView,

		sorting: {
			
			// disable sorting on delete column
			//
			headers: {
				0: {
					sorter: 'method'
				}
			},

			// sort on version column in ascending order 
			//
			sortList: [[0, 0]] 
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				editable: this.options.editable,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(model, index) {
			return {
				model: model,
				index: index,
				editable: this.options.editable,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete,
				parent: this
			}
		},

		onRender: function() {

			// call superclass method
			//
			SortableTableListView.prototype.onRender.call(this);
		}
	});
});
