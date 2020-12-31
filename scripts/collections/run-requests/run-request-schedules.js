/******************************************************************************\
|                                                                              |
|                              run-request-schedules.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a collection of assessment run request schedules.        |
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
	'config',
	'models/run-requests/run-request-schedule',
	'collections/base-collection'
], function($, _, Config, RunRequestSchedule, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: RunRequestSchedule,
		url: Config.servers.web + '/run_request_schedules',

		//
		// ajax methods
		//

		fetchByRunRequest: function(runRequest, options) {
			return this.fetch(_.extend(options, {
				url: this.url + '/run_requests/' + runRequest.get('run_request_uuid')
			}));
		},

		// allow bulk saving
		//
		save: function(options) {
			this.sync('update', this, options);
		}
	}, {

		//
		// static methods
		//

		fetchNumByProject: function(project, options) {
			return $.ajax(Config.servers.web + '/projects/' + project.get('project_uid') + '/run_requests/schedules/num', options);
		},

		fetchNumByProjects: function(projects, options) {
			return $.ajax(Config.servers.web + '/projects/' + projects.getUuidsStr() + '/run_requests/schedules/num', options);
		}
	});
});