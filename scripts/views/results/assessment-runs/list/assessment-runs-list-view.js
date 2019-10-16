/******************************************************************************\
|                                                                              |
|                            assessment-runs-list-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a list of execution records.        |
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
	'bootstrap/popover',
	'text!templates/results/assessment-runs/list/assessment-runs-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/results/assessment-runs/list/assessment-runs-list-item-view'
], function($, _, PopOvers, Template, BaseView, SortableTableListView, AssessmentRunsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: AssessmentRunsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No assessment results.")
		}),

		sorting: {

			// disable sorting on checkboxes and delete columns
			//
			headers: {
				6: {
					sorter: false
				}
			},

			// sort on date column in descending order
			//
			sortList: [[3, 1]]
		},

		groupExcept: ['select', 'delete', 'results', 'ssh'],

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
				showGrouping: this.options.showGrouping,
				showSortingColumn: true
			}));
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showNumbering: this.options.showNumbering,
				showStatus: this.options.showStatus,
				showErrors: this.options.showErrors,
				showDelete: this.options.showDelete,
				showSsh: this.options.showSsh
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
				project: this.model,
				viewer: this.options.viewer,
				errorViewer: this.options.errorViewer,
				queryString: this.options.queryString,
				showNumbering: this.options.showNumbering,
				showStatus: this.options.showStatus,
				showErrors: this.options.showErrors,
				showDelete: this.options.showDelete,
				showSsh: this.options.showSsh
			};
		},

		onRender: function() {

			// initialize popovers
			//
			this.$el.find("button").popover({
				trigger: 'hover',
				animation: true
			});

			// call superclass method
			//
			SortableTableListView.prototype.onRender.call(this);
		}
	});
});
