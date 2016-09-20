/******************************************************************************\
|                                                                              |
|                                assessment-router.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for assessment routes.       |
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

			// project assessment routes
			//
			'assessments(?*query_string)': 'showAssessments',
			'assessments/delete(?*query_string)': 'showDeleteAssessments',
			'assessments/run(?*query_string)': 'showRunAssessment'
		},

		//
		// assessment route handlers
		//

		showAssessments: function(queryString) {
			var self = this;
			require([
				'registry',
				'utilities/query-strings',
				'utilities/url-strings',
				'views/assessments/assessments-view'
			], function (Registry, QueryStrings, UrlStrings, AssessmentsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'assessments', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						fetchQueryStringData(parseQueryString(queryString, view.model), function(data) {

							// show project assessments view
							//
							view.content.show(
								new AssessmentsView({
									data: data,
									model: view.model
								})
							);
						});
					}
				});
			});
		},

		showDeleteAssessments: function(queryString) {
			var self = this;
			require([
				'registry',
				'utilities/query-strings',
				'utilities/url-strings',
				'views/assessments/delete/delete-assessments-view'
			], function (Registry, QueryStrings, UrlStrings, DeleteAssessmentsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'assessments', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						fetchQueryStringData(parseQueryString(queryString, view.model), function(data) {

							// show delete assessments view
							//
							view.content.show(
								new DeleteAssessmentsView({
									data: data,
									model: view.model
								})
							);
						});
					}
				});
			});
		},

		showRunAssessment: function(queryString) {
			var self = this;
			require([
				'registry',
				'utilities/query-strings',
				'utilities/url-strings',
				'models/projects/project',
				'views/dialogs/error-view',
				'views/assessments/run/run-assessment-view'
			], function (Registry, QueryStrings, UrlStrings, Project, ErrorView, RunAssessmentView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'assessments', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						fetchQueryStringData(parseQueryString(queryString, view.model), function(data) {
							
							// use trial project by default
							//
							if (!data['project']) {
								data['project'] = view.model;
							}

							// show run assessment view
							//
							view.content.show(
								new RunAssessmentView({
									data: data
								})
							);
						});
					}
				});
			});
		}
	});
});


