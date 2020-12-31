/******************************************************************************\
|                                                                              |
|                                 schedule-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for viewing a run request schedule.             |
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
	'text!templates/schedules/schedule/schedule.tpl',
	'collections/run-requests/run-request-schedules',
	'views/base-view',
	'views/schedules/profile/schedule-profile-view',
	'views/schedules/schedule/run-request-schedule-list/run-request-schedule-list-view'
], function($, _, Template, RunRequestSchedules, BaseView, ScheduleProfileView, RunRequestScheduleListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#schedule-profile',
			list: '#schedule-items-list'
		},

		events: {
			'click #edit': 'onClickEdit'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new RunRequestSchedules();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				project: this.options.project,
				editable: this.options.project != undefined
			};
		},

		onRender: function() {
			var self = this;
			
			this.showChildView('profile', new ScheduleProfileView({
				model: this.model
			}));

			// get schedule items
			//
			this.collection.fetchByRunRequest(this.model, {

				// callbacks
				//
				success: function() {

					// show schedule items list
					//
					self.showChildView('list', new RunRequestScheduleListView({
						collection: self.collection
					}));
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch items for this schedule."
					});
				}
			});
		},

		//
		// event handling methods
		//

		onClickEdit: function() {

			// go to edit schedules view
			//
			application.navigate('#run-requests/schedules/' + this.model.get('run_request_uuid') + '/edit');
		}
	});
});