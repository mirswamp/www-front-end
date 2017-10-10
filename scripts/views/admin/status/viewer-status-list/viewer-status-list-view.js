/******************************************************************************\
|                                                                              |
|                            viewer-status-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of viewer instance statuses.     |
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
	'text!templates/admin/status/viewer-status-list/viewer-status-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/admin/status/viewer-status-list/viewer-status-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, ViewerStatusListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ViewerStatusListItemView,

		sorting: {

			// sort on status column in ascending order 
			//
			sortList: [[3, 0]]
		},

		//
		// constructor
		//

		initialize: function() {

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
					collection: this.collection,
					showNumbering: this.options.showNumbering
				}));
			} else {
				return _.template("No viewers.")
			}
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				showNumbering: this.options.showNumbering
			}
		}
	});
});