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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/scheduled-runs/schedules/schedule/schedule.tpl',
	'registry',
	'collections/run-requests/run-request-schedules',
	'views/dialogs/error-view',
	'views/scheduled-runs/schedules/profile/schedule-profile-view',
	'views/scheduled-runs/schedules/schedule/run-request-schedules-list/run-request-schedules-list-view'
], function($, _, Backbone, Marionette, Template, Registry, RunRequestSchedules, ErrorView, ScheduleProfileView, RunRequestSchedulesListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			scheduleProfile: '#schedule-profile',
			scheduleItemsList: '#schedule-items-list'
		},

		events: {
			'click #ok': 'onClickOk',
			'click #edit': 'onClickEdit'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new RunRequestSchedules();
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				project: this.options.project
			}));
		},

		onRender: function() {
			var self = this;
			
			this.scheduleProfile.show(
				new ScheduleProfileView({
					model: this.model
				})
			);

			// get schedule items
			//
			this.collection.fetchByRunRequest(this.model, {

				// callbacks
				//
				success: function() {

					// show schedule items list
					//
					self.scheduleItemsList.show(
						new RunRequestSchedulesListView({
							collection: self.collection
						})
					);

					// enable or disable save button
					//
					if (self.collection.length === 0) {
						self.disableSaveButton();
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch items for this schedule."
						})
					);
				}
			});
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// go to run requests view
			//
			Backbone.history.navigate('#run-requests' + (!this.options.project.isTrialProject()? '?project=' + this.options.project.get('project_uid') : ''), {
				trigger: true
			});
		},

		onClickEdit: function() {

			// go to edit schedules view
			//
			Backbone.history.navigate('#run-requests/schedules/' + this.model.get('run_request_uuid') + '/edit', {
				trigger: true
			});
		}
	});
});