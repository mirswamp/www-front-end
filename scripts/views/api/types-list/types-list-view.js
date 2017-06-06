/******************************************************************************\
|                                                                              |
|                                 types-list-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of api data types.              |
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
	'text!templates/api/types-list/types-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/api/types-list/types-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, TypesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: TypesListItemView,

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
		// constructor
		//

		initialize: function(options) {

			// call superclass method
			//
			SortableTableListView.prototype.initialize.call(this, _.extend(options, {
				showGrouping: false,
				//groupExcept: ['api-method', 'api-server', 'api-route', 'unfinished', 'private']
			}));
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				editable: this.options.editable,
				showUnfinished: this.options.showUnfinished,
				showPrivate: this.options.showPrivate,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(model, index) {
			return {
				model: model,
				index: index,
				editable: this.options.editable,
				showUnfinished: this.options.showUnfinished,
				showPrivate: this.options.showPrivate,
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
