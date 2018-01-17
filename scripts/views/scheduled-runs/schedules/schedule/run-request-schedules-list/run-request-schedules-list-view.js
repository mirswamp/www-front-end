/******************************************************************************\
|                                                                              |
|                         run-request-schedules-list-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a list of run request schedules.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/scheduled-runs/schedules/schedule/run-request-schedules-list/run-request-schedules-list.tpl',
	'views/widgets/lists/table-list-view',
	'views/scheduled-runs/schedules/schedule/run-request-schedules-list/run-request-schedule-item-view'
], function($, _, Backbone, Marionette, Template, TableListView, RunRequestScheduleItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: RunRequestScheduleItemView,

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection
			}));
		}
	});
});