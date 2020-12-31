/******************************************************************************\
|                                                                              |
|                    package-dependencies-editable-list-view.js                |
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
	'text!templates/packages/info/versions/info/build/dependencies/editable-list/package-dependencies-editable-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/packages/info/versions/info/build/dependencies/editable-list/package-dependencies-editable-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, PackageDependenciesEditableListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: PackageDependenciesEditableListItemView,

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
					'platform_version_uuid': model? model.get('platform_version_uuid') : null
				})[0],
				showDelete: this.options.showDelete,
				parent: this
			};
		},

		//
		// event handling methods
		//

		onChange: function() {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onSortEnd: function() {
			this.renumber();
		}
	});
});