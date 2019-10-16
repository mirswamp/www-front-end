/******************************************************************************\
|                                                                              |
|                               projects-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of projects.                |
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
	'text!templates/projects/list/projects-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/projects/list/projects-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, ProjectsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ProjectsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No projects.")
		}),

		sorting: {

			// disable sorting on delete column
			//
			headers: { 
				3: { 
					sorter: false 
				}
			},

			// sort on date column in descending order 
			//
			sortList: [[2, 1]]
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showNumbering: this.options.showNumbering,
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
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete,
				parent: this
			};
		}
	});
});