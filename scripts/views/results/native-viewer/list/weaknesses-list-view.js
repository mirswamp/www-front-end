/******************************************************************************\
|                                                                              |
|                              weaknesses-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of weaknesses.              |
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
	'text!templates/results/native-viewer/list/weaknesses-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/results/native-viewer/list/weaknesses-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, WeaknessesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		className: 'results',
		template: _.template(Template),
		childView: WeaknessesListItemView,

		emptyView: BaseView.extend({
			template: _.template("No weaknesses have been found.")
		}),

		sorting: {

			// sort on filename column in ascending order 
			//
			sortList: [[0, 0], [1, 0]]
		},

		groupExcept: ['group', 'code'],

		//
		// rendering methods
		//

		templateContext: function() {
			return _.extend({
				showNumbering: this.options.showNumbering
			}, this.collection && this.collection.length > 0? this.collection.at(0).attributes : null);
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
				index: (this.options.start || 0) + this.collection.indexOf(model),
				showNumbering: this.options.showNumbering,
				filter_type: this.options.filter_type,
				filter: this.options.filter,
				parent: this
			};
		}
	});
});