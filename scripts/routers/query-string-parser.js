/******************************************************************************\
|                                                                              |
|                               query-string-parser.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for results routes.          |
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
	'utilities/web/query-strings',
	'utilities/web/url-strings',
	'models/projects/project',
	'models/packages/package',
	'models/packages/package-version',
	'models/tools/tool',
	'models/tools/tool-version',
	'models/platforms/platform',
	'models/platforms/platform-version',
	'models/run-requests/run-request',
	'collections/projects/projects',
], function($, _, QueryStrings, UrlStrings, Project, Package, PackageVersion, Tool, ToolVersion, Platform, PlatformVersion, RunRequest, Projects) {
	return {

		// whether or not to report errors
		//
		verbose: false,

		createProject: function(data, project) {

			// create project from query string data
			//
			if (data.project == 'default') {

				// use the default 'trial' project
				//
				data.project	= project;	
			} else if (data.project == 'any' || !data.project) {

				// use all projects
				//
				data.project = undefined;
			} else {

				// use a particular specified project
				//
				data.project = new Project({
					project_uid: data.project
				});
			}

			// fetch data for all projects
			//
			data.projects = new Projects();

			return data;
		},

		create: function(data) {

			// create models from query string data
			//
			if (data.package) {
				data.package = new Package({
					package_uuid: data.package
				});
			}
			if (data['package-version'] && data['package-version'] != 'latest') {
				data['package-version'] = new PackageVersion({
					package_version_uuid: data['package-version']
				});
			}
			if (data.tool) {
				data.tool = new Tool({
					tool_uuid: data.tool
				});
			}
			if (data['tool-version'] && data['tool-version'] != 'latest') {
				data['tool-version'] = new ToolVersion({
					tool_version_uuid: data['tool-version']
				});
			}
			if (data.platform) {
				data.platform = new Platform({
					platform_uuid: data.platform
				});
			}
			if (data['platform-version'] && data['platform-version'] != 'latest') {
				data['platform-version'] = new PlatformVersion({
					platform_version_uuid: data['platform-version']
				});
			}

			// parse limit
			//
			if (data.limit) {
				if (data.limit != 'none') {
					data.limit = parseInt(data.limit);
				} else {
					data.limit = null;
				}
			}

			return data;
		},

		createVersions: function(data) {

			// create models from version data
			//
			if (data['package-version'] && data['package-version'] != 'latest') {
				data.package = new Package({
					package_uuid: data['package-version'].get('package_uuid')
				});
			}
			if (data['tool-version'] && data['tool-version'] != 'latest') {
				data.tool = new Tool({
					tool_uuid: data['tool-version'].get('tool_uuid')
				});
			}
			if (data['platform-version'] && data['platform-version'] != 'latest') {
				data.platform = new Platform({
					platform_uuid: data['platform-version'].get('platform_uuid')
				});
			}

			return data;
		},

		//
		// query string methods
		//
		
		parseProject: function(queryString, project) {

			// parse query string
			//
			return this.createProject(queryStringToData(queryString), project);
		},

		parse: function(queryString, project) {

			// parse query string
			//
			return this.create(this.parseProject(queryString, project));
		},

		fetch: function(data, done) {
			var self = this;

			// fetch models
			//
			$.when(
				data.project? data.project.fetch() : null,
				data.projects? data.projects.fetch() : null,
				data.package? data.package.fetch() : null,
				data['package-version'] && data['package-version'] != 'latest'? data['package-version'].fetch() : null,
				data.tool? data.tool.fetch() : null,
				data['tool-version'] && data['tool-version'] != 'latest'? data['tool-version'].fetch() : null,
				data.platform? data.platform.fetch() : null,
				data['platform-version'] && data['platform-version'] != 'latest'? data['platform-version'].fetch() : null
			).done(function(project, projects, package, packageVersion, tool, toolVersion, platform, platformVersion) {
				self.createVersions(data);

				// fetch models
				//
				$.when(
					data['package-version'] && data['package-version'] != 'latest'? data.package.fetch() : null,
					data['tool-version'] && data['tool-version'] != 'latest'? data.tool.fetch() : null,
					data['platform-version'] && data['platform-version'] != 'latest'? data.platform.fetch() : null
				).done(function(packageVersion, toolVersion, platformVersion) {

					// perform callback
					//
					done(data);				
				});
			}).fail(function() {
				if (self.verbose) {

					// show error message
					//
					application.error({
						message: "The URL address contains an invalid query string."
					});

				} else {

					// perform same action as success
					//
					self.createVersions(data);

					// fetch models
					//
					$.when(
						data['package-version'] && data['package-version'] != 'latest'? data.package.fetch() : null,
						data['tool-version'] && data['tool-version'] != 'latest'? data.tool.fetch() : null,
						data['platform-version'] && data['platform-version'] != 'latest'? data.platform.fetch() : null
					).done(function(packageVersion, toolVersion, platformVersion) {

						// perform callback
						//
						done(data);				
					});
				}
			});
		}
	};
});