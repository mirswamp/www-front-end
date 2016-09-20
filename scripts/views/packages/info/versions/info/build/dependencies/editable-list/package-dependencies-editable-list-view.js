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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/info/build/dependencies/editable-list/package-dependencies-editable-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/packages/info/versions/info/build/dependencies/editable-list/package-dependencies-editable-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, PackageDependenciesEditableListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		events: {
			'click #add-new-dependency': 'onClickAddNewDependency'
		},

		childView: PackageDependenciesEditableListItemView,

		sorting: {

			// disable sorting on delete column
			//
			headers: {
				3: { 
					sorter: false 
				}
			},

			// sort on name in ascending order 
			//
			sortList: [[0, 0]]
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showNumbering: this.options.showNumbering
			}));
		},

		childViewOptions: function(model, index) {

			// find dependency's platform
			//
			var platformVersion = this.options.platformVersions.where({
				'platform_version_uuid': model.get('platform_version_uuid')
			})[0];

			return {
				model: model,
				index: index,
				platformVersion: platformVersion,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete,
				parent: this
			}
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

		onClickAddNewDependency: function() {
			var self = this;
			require([
				'registry',
				'views/packages/info/versions/info/build/dependencies/editable-list/dialogs/add-new-package-dependency-view'
			], function (Registry, AddNewPackageDependencyView) {

				// show add new package dependency dialog
				//
				Registry.application.modal.show(
					new AddNewPackageDependencyView({
						packageVersion: self.model,
						collection: self.collection,
						platformVersions: self.options.platformVersions,

						// callbacks
						//
						onAdd: function() {

							// update
							//
							self.render();
							self.onChange();
						}
					})
				);
			});
		},

		onSortEnd: function() {
			this.renumber();
		}
	});
});