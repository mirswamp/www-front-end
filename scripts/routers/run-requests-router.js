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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'registry',
	'models/projects/project',
	'models/packages/package',
	'models/packages/package-version',
	'models/tools/tool',
	'models/tools/tool-version',
	'models/platforms/platform',
	'models/platforms/platform-version',
	'collections/projects/projects'
], function($, _, Backbone, Registry, Project, Package, PackageVersion, Tool, ToolVersion, Platform, PlatformVersion, Projects) {

	//
	// query string methods
	//

	function parseProjectQueryString(queryString, project) {

		// parse query string
		//
		var data = queryStringToData(queryString);

		// create project from query string data
		//
		if (data['project'] == 'none') {

			// use the default 'trial' project
			//
			data['project']	= project;	
		} else if (data['project'] == 'any' || !data['project']) {

			// use all projects
			//
			data['project'] = undefined;
		} else {

			// use a particular specified project
			//
			data['project'] = new Project({
				project_uid: data['project']
			});
		}

		// fetch data for all projects
		//
		data['projects'] = new Projects();

		return data;
	}

	function parseQueryString(queryString, project) {

		// parse query string
		//
		var data = parseProjectQueryString(queryString, project);

		// create models from query string data
		//
		if (data['package']) {
			data['package'] = new Package({
				package_uuid: data['package']
			});
		}
		if (data['package-version'] && data['package-version'] != 'latest') {
			data['package-version'] = new PackageVersion({
				package_version_uuid: data['package-version']
			});
		}
		if (data['tool']) {
			data['tool'] = new Tool({
				tool_uuid: data['tool']
			});
		}
		if (data['tool-version'] && data['tool-version'] != 'latest') {
			data['tool-version'] = new ToolVersion({
				tool_version_uuid: data['tool-version']
			});
		}
		if (data['platform']) {
			data['platform'] = new Platform({
				platform_uuid: data['platform']
			});
		}
		if (data['platform-version'] && data['platform-version'] != 'latest') {
			data['platform-version'] = new PlatformVersion({
				platform_version_uuid: data['platform-version']
			});
		}

		// parse limit
		//
		if (data['limit']) {
			if (data['limit'] != 'none') {
				data['limit'] = parseInt(data['limit']);
			} else {
				data['limit'] = null;
			}
		}

		return data;
	}

	function fetchQueryStringData(data, done) {

		// fetch models
		//
		$.when(
			data['project']? data['project'].fetch() : true,
			data['projects']? data['projects'].fetch() : true,
			data['package']? data['package'].fetch() : true,
			data['package-version'] && data['package-version'] != 'latest'? data['package-version'].fetch() : true,
			data['tool']? data['tool'].fetch() : true,
			data['tool-version'] && data['tool-version'] != 'latest'? data['tool-version'].fetch() : true,
			data['platform']? data['platform'].fetch() : true,
			data['platform-version'] && data['platform-version'] != 'latest'? data['platform-version'].fetch() : true
		).then(function() {

			// create models from version data
			//
			if (data['package-version'] && data['package-version'] != 'latest') {
				data['package'] = new Package({
					package_uuid: data['package-version'].get('package_uuid')
				});
			}
			if (data['tool-version'] && data['tool-version'] != 'latest') {
				data['tool'] = new Tool({
					tool_uuid: data['tool-version'].get('tool_uuid')
				});
			}
			if (data['platform-version'] && data['platform-version'] != 'latest') {
				data['platform'] = new Platform({
					platform_uuid: data['platform-version'].get('platform_uuid')
				});
			}

			// fetch models
			//
			$.when(
				data['package-version'] && data['package-version'] != 'latest'? data['package'].fetch() : true,
				data['tool-version'] && data['tool-version'] != 'latest'? data['tool'].fetch() : true,
				data['platform-version'] && data['platform-version'] != 'latest'? data['platform'].fetch() : true
			).then(function() {

				// perform callback
				//
				done(data);				
			});
		});
	}

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
				'utilities/query-strings',
				'utilities/url-strings',
				'collections/viewers/viewers',
				'views/dialogs/error-view',
				'views/scheduled-runs/scheduled-runs-view'
			], function (Registry, QueryStrings, UrlStrings, Viewers, ErrorView, ScheduledRunsView) {

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
						fetchQueryStringData(parseQueryString(queryString, view.model), function(data) {

							// show run requests view
							//
							view.content.show(
								//new RunRequestsView({
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
				'utilities/query-strings',
				'utilities/url-strings',
				'models/projects/project',
				'views/dialogs/error-view',
				'views/scheduled-runs/schedule-run-requests/schedule-run-requests-view'
			], function (Registry, QueryStrings, UrlStrings, Project, ErrorView, ScheduleRunRequestsView) {

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
						fetchQueryStringData(parseQueryString(queryString, view.model), function(data) {

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
				'utilities/query-strings',
				'utilities/url-strings',
				'models/projects/project',
				'views/dialogs/error-view',
				'views/scheduled-runs/schedules/add/add-schedule-view'
			], function (Registry, QueryStrings, UrlStrings, Project, ErrorView, AddScheduleView) {

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
						fetchQueryStringData(parseQueryString(queryString, view.model), function(data) {
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
				'models/run-requests/run-request',
				'views/scheduled-runs/schedules/schedule/schedule-view',
				'views/dialogs/error-view'
			], function (Registry, RunRequest, ScheduleView, ErrorView) {

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
				'models/run-requests/run-request',
				'views/scheduled-runs/schedules/edit/edit-schedule-view',
				'views/dialogs/error-view'
			], function (Registry, RunRequest, EditScheduleView, ErrorView) {

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
				'utilities/query-strings',
				'utilities/url-strings',
				'models/projects/project',
				'views/dialogs/error-view',
				'views/scheduled-runs/schedules/schedules-view'
			], function (Registry, QueryStrings, UrlStrings, Project, ErrorView, SchedulesView) {

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
						fetchQueryStringData(parseQueryString(queryString, view.model), function(data) {
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


