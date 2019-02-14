/******************************************************************************\
|                                                                              |
|                               packages-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of packages for review.     |
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
	'text!templates/packages/list/packages-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/packages/list/packages-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, PackagesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: PackagesListItemView,

		sorting: {

			// disable sorting on delete column
			//
			headers: {
				4: { 
					sorter: false 
				},
				5: { 
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

		template: function(data) {
			if (this.collection.length > 0) {
				return _.template(Template, _.extend(data, {
					collection: this.collection,	
					showNumbering: this.options.showNumbering,
					showProjects: this.options.showProjects,
					showDelete: this.options.showDelete
				}));
			} else {
				return _.template("No packages have been uploaded.");
			}
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				showDeactivatedPackages: this.options.showDeactivatedPackages,
				showNumbering: this.options.showNumbering,
				showProjects: this.options.showProjects,
				showDelete: this.options.showDelete
			};
		}
	});
});