/******************************************************************************\
|                                                                              |
|                          scheduled-runs-lists-item-view.js                   |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/tooltip',
	'text!templates/scheduled-runs/lists/scheduled-runs-lists-item.tpl',
	'collections/assessments/scheduled-runs',
	'views/scheduled-runs/list/scheduled-runs-list-view'
], function($, _, Backbone, Marionette, Tooltip, Template, ScheduledRuns, ScheduledRunsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			scheduledRuns: '.scheduled-runs',
		},

		//
		// querying methods
		//

		getRunRequestUrl: function() {
			if (this.model && this.model.get('project_uuid') != null) {
				return '#run-requests/schedules/' + this.model.get('run_request_uuid');
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				runRequestUrl: this.getRunRequestUrl()
			}));
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
			var scheduledRuns = new ScheduledRuns(this.model.get('scheduled_runs'), {
				parse: true
			});
			for (var i = 0; i < scheduledRuns.length; i++) {
				scheduledRuns.at(i).set('run_request', this.model);
			}

			this.scheduledRuns.show(
				new ScheduledRunsListView({
					collection: scheduledRuns,
					showDelete: true
				})
			);
		}
	});
});