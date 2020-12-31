/******************************************************************************\
|                                                                              |
|                       run-request-schedule-list-view.js                      |
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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/schedules/schedule/run-request-schedule-list/run-request-schedule-list.tpl',
	'views/base-view',
	'views/collections/tables/table-list-view',
	'views/schedules/schedule/run-request-schedule-list/run-request-schedule-list-item-view'
], function($, _, Template, BaseView, TableListView, RunRequestScheduleListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: RunRequestScheduleListItemView,

		emptyView: BaseView.extend({
			template: _.template("No schedules.")
		}),

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