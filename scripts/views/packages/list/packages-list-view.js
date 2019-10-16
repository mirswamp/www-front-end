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
	'text!templates/packages/list/packages-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/packages/list/packages-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, PackagesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: PackagesListItemView,

		emptyView: BaseView.extend({
			template: _.template("No packages.")
		}),

		sorting: {

			// sort on name column in ascending order 
			//
			sortList: [[0, 0]]
		},

		//
		// constructor
		//

		initialize: function() {
			if (this.options.showProjects) {

				// disable sorting on projects, versions, and delete columns
				//
				this.sorting.headers = {
					2: { 
						sorter: false 
					},
					4: { 
						sorter: false 
					},
					5: { 
						sorter: false 
					}
				};
			} else {

				// disable sorting on versions and delete columns
				//
				this.sorting.headers = {
					3: { 
						sorter: false 
					},
					4: { 
						sorter: false 
					}
				};
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,	
				showNumbering: this.options.showNumbering,
				showProjects: this.options.showProjects,
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
				showDeactivatedPackages: this.options.showDeactivatedPackages,
				showNumbering: this.options.showNumbering,
				showProjects: this.options.showProjects,
				showDelete: this.options.showDelete
			};
		}
	});
});