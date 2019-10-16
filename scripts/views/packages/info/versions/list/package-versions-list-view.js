/******************************************************************************\
|                                                                              |
|                            package-versions-list-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a list of package versions.         |
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
	'text!templates/packages/info/versions/list/package-versions-list.tpl',
	'models/utilities/version',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/packages/info/versions/list/package-versions-list-item-view'
], function($, _, Template, Version, BaseView, SortableTableListView, PackageVersionsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: PackageVersionsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No package versions.")
		}),

		sorting: {

			// disable sorting on delete column
			//
			headers: {
				0: {
					sorter: 'versions'
				},
				
				3: { 
					sorter: false 
				},

				4: { 
					sorter: false 
				}
			},

			// sort on version column in descending order 
			//
			sortList: [[0, 1]] 
		},

		sortParsers: [{

			// set a unique id 
			//
			id: 'versions',

			is: function(s) {

				// return false so this parser is not auto detected 
				//
				return false;
			},

			format: function(string) {
				return Version.comparator(string);
			},

			// set type, either numeric or text
			//
			type: 'numeric'
		}],

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				collection: this.collection,
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				showDelete: this.model.isOwned()
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
				model: model,
				index: this.collection.indexOf(model),
				package: this.model,
				collection: this.collection,
				showProjects: this.options.showProjects,
				showDelete: this.model.isOwned(),
				showNumbering: this.options.showNumbering
			};
		}
	});
});
