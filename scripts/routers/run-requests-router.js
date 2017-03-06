/******************************************************************************\
|                                                                              |
|                               run-requests-router.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for run requests routes.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {

	// create router
	//
	return Backbone.Router.extend({

		//
		// route definitions
		//

		routes: {

			// run request routes
			//
			'run-requests(?*query_string)': 'showRunRequests',
			'run-requests/add(?*query_string)': 'showAddRunRequests',

			// run request schedule routes
			//
			'run-requests/schedules/add(?*query_string)': 'showAddRunRequestSchedule',
			'run-requests/schedules/:run_request_id': 'showRunRequestSchedule',
			'run-requests/schedules/:run_request_id/edit': 'showEditRunRequestSchedule',
			'run-requests/schedules(?*query_string)': 'showRunRequestSchedules',
		},

		//
		// run request route handlers
		//

		showRunRequests: function(queryString) {
			var self = this;
			require([
				'registry',
				'routers/query-string-parser',
				'collections/viewers/viewers',
				'views/dialogs/error-view',
				'views/scheduled-runs/scheduled-runs-view'
			], function (Registry, QueryStringParser, Viewers, ErrorView, ScheduledRunsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'runs', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {

							// show run requests view
							//
							view.content.show(
								new ScheduledRunsView({
									data: data,
									model: view.model
								})
							);
						});
					}
				});
			});
		},

		showAddRunRequests: function(queryString) {
			var self = this;
			require([
				'registry',
				'routers/query-string-parser',
				'models/projects/project',
				'views/dialogs/error-view',
				'views/scheduled-runs/schedule-run-requests/schedule-run-requests-view'
			], function (Registry, QueryStringParser, Project, ErrorView, ScheduleRunRequestsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'runs', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {

							// show project's schedule run requests view
							//
							view.content.show(
								new ScheduleRunRequestsView({
									model: data['project'] || view.model,
									data: data
								})
							);
						});
					}
				});
			});
		},

		//
		// run request schedule routes
		//

		showAddRunRequestSchedule: function(queryString) {
			var self = this;
			require([
				'registry',
				'routers/query-string-parser',
				'models/projects/project',
				'views/dialogs/error-view',
				'views/scheduled-runs/schedules/add/add-schedule-view'
			], function (Registry, QueryStringParser, Project, ErrorView, AddScheduleView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'runs', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {
							if (data['project']) {

								// show project's add schedule view
								//
								view.content.show(
									new AddScheduleView({
										project: data['project'],
										assessmentRunUuids: data['assessments']
									})
								);
							} else {

								// show my add schedule view
								//
								view.content.show(
									new AddScheduleView({
										project: view.model,
										assessmentRunUuids: data['assessments']
									})
								);
							}
						});
					}
				});
			});
		},

		showRunRequestSchedule: function(runRequestUuid) {
			var self = this;
			require([
				'registry',
				'models/projects/project',
				'models/run-requests/run-request',
				'views/scheduled-runs/schedules/schedule/schedule-view',
				'views/dialogs/error-view'
			], function (Registry, Project, RunRequest, ScheduleView, ErrorView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'runs', 

					// callbacks
					//
					done: function(view) {

						// get run request
						//
						var runRequest = new RunRequest({
							'run_request_uuid': runRequestUuid
						});

						runRequest.fetch({

							// callbacks
							//
							success: function() {

								// fetch run request's project
								//
								var project = new Project({
									project_uid: runRequest.get('project_uuid')
								});

								project.fetch({

									// callbacks
									//
									success: function() {

										// show schedule view
										//
										view.content.show(
											new ScheduleView({
												model: runRequest,
												project: project
											})
										);
									},

									error: function() {

										// show error dialog
										//
										Registry.application.modal.show(
											new ErrorView({
												message: "Could not fetch run request's project."
											})
										);				
									}
								});
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not fetch run request."
									})
								);
							}
						});
					}
				});
			});
		},

		showEditRunRequestSchedule: function(runRequestUuid) {
			var self = this;
			require([
				'registry',
				'models/projects/project',
				'models/run-requests/run-request',
				'views/scheduled-runs/schedules/edit/edit-schedule-view',
				'views/dialogs/error-view'
			], function (Registry, Project, RunRequest, EditScheduleView, ErrorView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'runs', 

					// callbacks
					//
					done: function(view) {

						// get run request
						//
						var runRequest = new RunRequest({
							'run_request_uuid': runRequestUuid
						});

						runRequest.fetch({

							// callbacks
							//
							success: function() {

								// fetch run request's project
								//
								var project = new Project({
									project_uid: runRequest.get('project_uuid')
								});

								project.fetch({

									// callbacks
									//
									success: function() {

										// show schedule view
										//
										view.content.show(
											new EditScheduleView({
												model: runRequest,
												project: project
											})
										);
									},

									error: function() {

										// show error dialog
										//
										Registry.application.modal.show(
											new ErrorView({
												message: "Could not fetch run request's project."
											})
										);				
									}
								});
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not fetch run request."
									})
								);
							}
						});
					}
				});
			});
		},

		showRunRequestSchedules: function(queryString) {
			var self = this;
			require([
				'registry',
				'routers/query-string-parser',
				'models/projects/project',
				'views/dialogs/error-view',
				'views/scheduled-runs/schedules/schedules-view'
			], function (Registry, QueryStringParser, Project, ErrorView, SchedulesView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'runs', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {
							view.content.show(
								new SchedulesView({
									data: data,
									model: view.model
								})
							);
						});
					}
				});
			});
		}
	});
});


