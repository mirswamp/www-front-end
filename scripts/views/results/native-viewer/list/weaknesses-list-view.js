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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/results/native-viewer/list/weaknesses-list.tpl',
	'views/base-view',
	'views/collections/tables/groupable-table-list-view',
	'views/results/native-viewer/list/weaknesses-list-item-view'
], function($, _, Template, BaseView, GroupableTableListView, WeaknessesListItemView) {
	return GroupableTableListView.extend({

		//
		// attributes
		//

		className: 'results',
		template: _.template(Template),
		childView: WeaknessesListItemView,

		emptyView: BaseView.extend({
			template: _.template("No weaknesses have been found.")
		}),

		// sort by filename in ascending order 
		//
		sortBy: ['file', 'ascending'],

		// disable grouping on selected columns
		//
		groupExcept: ['group', 'code'],

		//
		// rendering methods
		//

		templateContext: function() {
			return this.collection && this.collection.length > 0? this.collection.at(0).attributes : null;
		},

		onRender: function() {

			// call superclass method
			//
			GroupableTableListView.prototype.onRender.call(this);

			// set starting line number
			//
			this.$el.css('counter-reset', 'row-number ' + this.options.start);
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
				filter_type: this.options.filter_type,
				filter: this.options.filter,
				parent: this
			};
		}
	});
});