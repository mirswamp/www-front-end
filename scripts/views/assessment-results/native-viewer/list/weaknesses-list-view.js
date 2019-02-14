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
	'backbone',
	'marionette',
	'text!templates/assessment-results/native-viewer/list/weaknesses-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/assessment-results/native-viewer/list/weaknesses-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, WeaknessesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		tagName: 'table',
		className: 'results',
		childView: WeaknessesListItemView,

		sorting: {

			// sort on name column in ascending order 
			//
			sortList: [[0, 0]]
		},

		//
		// constructor
		//

		initialize: function(options) {

			// use specified sort order 
			//
			if (options.sortList) {
				this.sorting.sortList = options.sortList;
			}

			// call superclass method
			//
			SortableTableListView.prototype.initialize.call(this, _.extend(options, {
				sorting: true,
				showSortingColumn: true,
				showGrouping: this.options.showGrouping,
				groupExcept: ['line-number', 'column-number', 'group', 'code']
			}));

			// set line numbering start
			//
			this.start = this.options.start || 0;
		},

		//
		// rendering methods
		//

		template: function(data) {
			if (this.collection.length > 0) {
				return _.template(Template, _.extend(this.collection.at(0).attributes, {
					showNumbering: this.options.showNumbering
				}));
			} else {
				return _.template("No weaknesses have been found.");
			}
		},

		childViewOptions: function(model, index) {
			return {
				index: index + this.start,
				showNumbering: this.options.showNumbering,
				parent: this
			};
		}
	});
});