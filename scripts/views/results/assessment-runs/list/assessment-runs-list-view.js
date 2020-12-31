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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/popover',
	'text!templates/results/assessment-runs/list/assessment-runs-list.tpl',
	'views/base-view',
	'views/collections/tables/groupable-table-list-view',
	'views/results/assessment-runs/list/assessment-runs-list-item-view'
], function($, _, PopOvers, Template, BaseView, GroupableTableListView, AssessmentRunsListItemView) {
	return GroupableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: AssessmentRunsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No assessment results.")
		}),

		// sort by date column in descending order 
		//
		sortBy: ['date', 'descending'],

		// disable grouping on selected columns
		//
		groupExcept: ['select', 'delete', 'results', 'ssh'],

		//
		// constructor
		//

		initialize: function(options) {

			// call superclass method
			//
			GroupableTableListView.prototype.initialize.call(this, _.extend(options, {
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

				// options
				//
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

				// options
				//
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
			GroupableTableListView.prototype.onRender.call(this);
		}
	});
});
