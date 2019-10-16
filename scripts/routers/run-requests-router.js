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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'routers/base-router'
], function($, _, BaseRouter) {

	// create router
	//
	return BaseRouter.extend({

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
				'routers/query-string-parser',
				'collections/viewers/viewers',
							'views/scheduled-runs/scheduled-runs-view'
			], function (QueryStringParser, Viewers, ScheduledRunsView) {

				// show content view
				//
				application.showContent({
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
							view.showChildView('content', new ScheduledRunsView({
								data: data,
								model: view.model
							}));
						});
					}
				});
			});
		},

		showAddRunRequests: function(queryString) {
			var self = this;
			require([
				'routers/query-string-parser',
				'models/projects/project',
							'views/scheduled-runs/schedule-run-requests/schedule-run-requests-view'
			], function (QueryStringParser, Project, ScheduleRunRequestsView) {

				// show content view
				//
				application.showContent({
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
							view.showChildView('content', new ScheduleRunRequestsView({
								model: data['project'] || view.model,
								data: data
							}));
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
				'routers/query-string-parser',
				'models/projects/project',
							'views/scheduled-runs/schedules/add/add-schedule-view'
			], function (QueryStringParser, Project, AddScheduleView) {

				// show content view
				//
				application.showContent({
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
								view.showChildView('content', new AddScheduleView({
									project: data['project'],
									assessmentRunUuids: data['assessments']
								}));
							} else {

								// show my add schedule view
								//
								view.showChildView('content', new AddScheduleView({
									project: view.model,
									assessmentRunUuids: data['assessments']
								}));
							}
						});
					}
				});
			});
		},

		showRunRequestSchedule: function(runRequestUuid) {
			var self = this;
			require([
				'models/projects/project',
				'models/run-requests/run-request',
				'views/scheduled-runs/schedules/schedule/schedule-view',
						], function (Project, RunRequest, ScheduleView) {

				// show content view
				//
				application.showContent({
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
										view.showChildView('content', new ScheduleView({
											model: runRequest,
											project: project
										}));
									},

									error: function() {

										// show error message
										//
										application.error({
											message: "Could not fetch run request's project."
										});				
									}
								});
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not fetch run request."
								});
							}
						});
					}
				});
			});
		},

		showEditRunRequestSchedule: function(runRequestUuid) {
			var self = this;
			require([
				'models/projects/project',
				'models/run-requests/run-request',
				'views/scheduled-runs/schedules/edit/edit-schedule-view',
						], function (Project, RunRequest, EditScheduleView) {

				// show content view
				//
				application.showContent({
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
										view.showChildView('content', new EditScheduleView({
											model: runRequest,
											project: project
										}));
									},

									error: function() {

										// show error message
										//
										application.error({
											message: "Could not fetch run request's project."
										});				
									}
								});
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not fetch run request."
								});
							}
						});
					}
				});
			});
		},

		showRunRequestSchedules: function(queryString) {
			var self = this;
			require([
				'routers/query-string-parser',
				'models/projects/project',
							'views/scheduled-runs/schedules/schedules-view'
			], function (QueryStringParser, Project, SchedulesView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'runs', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {
							view.showChildView('content', new SchedulesView({
								data: data,
								model: view.model
							}));
						});
					}
				});
			});
		}
	});
});