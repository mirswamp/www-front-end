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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
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

		// sort by package column in ascending order 
		//
		sortBy: ['package', 'ascending'],
		unsorted: SortableTableListView.prototype.unsorted.concat(
			['projects', 'versions']),
		groupExcept: SortableTableListView.prototype.unsorted.concat(
			['projects']),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,	
				showProjects: this.options.showProjects,
				showDelete: this.options.showDelete
			};
		},

		childViewOptions: function(model) {

			// return view options
			//
			return {
				index: this.collection.indexOf(model),
				showDeactivatedPackages: this.options.showDeactivatedPackages,
				showProjects: this.options.showProjects,
				showDelete: this.options.showDelete,
				parent: this
			};
		}
	});
});