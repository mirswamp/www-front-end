/******************************************************************************\
|                                                                              |
|                         scheduled-runs-lists-item-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single scheduled run lists item.    |
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
	'text!templates/scheduled-runs/lists/scheduled-runs-lists-item.tpl',
	'collections/assessments/scheduled-runs',
	'views/base-view',
	'views/scheduled-runs/list/scheduled-runs-list-view'
], function($, _, Template, ScheduledRuns, BaseView, ScheduledRunsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '.scheduled-runs',
		},

		//
		// querying methods
		//

		getRunRequestUrl: function() {
			if (this.model && this.model.get('project_uuid') != null) {
				return '#run-requests/schedules/' + this.model.get('run_request_uuid');
			}
		},

		getSorting: function() {
			return this.getChildView('list').getSorting();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				runRequestUrl: this.getRunRequestUrl()
			};
		},

		onRender: function() {

			// show child views
			//
			this.showScheduledRuns();

			// show tooltips
			//
			this.$el.find("[data-toggle='tooltip']").tooltip({
				trigger: 'hover'
			});
		},

		showScheduledRuns: function() {
			this.showChildView('list', new ScheduledRunsListView({
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				showProjects: this.options.showProjects,
				showGrouping: this.options.showGrouping,
				showDelete: true,

				// callbalcks
				//
				onDelete: this.options.onDelete
			}));
		}
	});
});