/******************************************************************************\
|                                                                              |
|                                 routes-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of api methods / routes.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'registry',
	'text!templates/api/routes-list/routes-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/api/routes-list/routes-list-item-view'
], function($, _, Backbone, Marionette, Registry, Template, SortableTableListView, RoutesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: RoutesListItemView,

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

		sortParsers: [{

			// set a unique id 
			//
			id: 'method',

			is: function(s) {

				// return false so this parser is not auto detected 
				//
				return false;
			},

			format: function(string) {
				switch (string.trim()) {
					case 'POST':
						return 0;
					case 'GET':
						return 1;
					case 'PUT':
						return 2;
					case 'DELETE':
						return 3;
				}
			},

			// set type, either numeric or text
			//
			type: 'numeric'
		}],

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
				showServer: this.options.showServer,
				showCategory: this.options.showCategory,
				showUnfinished: this.options.showUnfinished,
				showPrivate: this.options.showPrivate,
				showNumbering: this.options.showNumbering,
				showGrouping: true,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(model, index) {
			return {
				model: model,
				index: index,
				editable: this.options.editable,
				showServer: this.options.showServer,
				showCategory: this.options.showCategory,
				showUnfinished: this.options.showUnfinished,
				showPrivate: this.options.showPrivate,
				showNumbering: this.options.showNumbering,
				showGrouping: this.options.showGrouping,
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
