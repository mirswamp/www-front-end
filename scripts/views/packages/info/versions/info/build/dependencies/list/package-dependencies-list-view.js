/******************************************************************************\
|                                                                              |
|                         package-dependencies-list-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines read only list view of a package's dependencies          |
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
	'text!templates/packages/info/versions/info/build/dependencies/list/package-dependencies-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/packages/info/versions/info/build/dependencies/list/package-dependencies-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, PackageDependenciesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: PackageDependenciesListItemView,

		emptyView: BaseView.extend({
			template: _.template("No package dependencies.")
		}),

		// sort by platform column in ascending order 
		//
		sortBy: ['platform', 'ascending'],
		
		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection
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
				platformVersion: this.options.platformVersions.where({
					'platform_version_uuid': model.get('platform_version_uuid')
				})[0]
			};
		},

		//
		// event handling methods
		//

		onSortEnd: function() {
			this.renumber();
		}
	});
});