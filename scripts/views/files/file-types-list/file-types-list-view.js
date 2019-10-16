/******************************************************************************\ 
|                                                                              |
|                              file-types-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package version's source          |
|        file types.                                                           |
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
	'text!templates/files/file-types-list/file-types-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/files/file-types-list/file-types-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, FileTypesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: FileTypesListItemView,

		emptyView: BaseView.extend({
			template: _.template("No file types.")
		}),

		sorting: {

			// sort on count column in descending order 
			//
			sortList: [[1, 1]] 
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection
			};
		}
	});
});
