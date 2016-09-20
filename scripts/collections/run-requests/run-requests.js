/******************************************************************************\
|                                                                              |
|                                 run-requests.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of assessment run requests.            |
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
	'config',
	'models/run-requests/run-request'
], function($, _, Backbone, Config, RunRequest) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: RunRequest,
		url: Config.servers.csa + '/run_requests',

		//
		// querying methods
		//

		contains: function(runRequest) {
			for (var i = 0; i < this.length; i++) {
				if (this.at(i).isSameAs(runRequest)) {
					return true;
				}
			}
			return false;
		},
		
		findRunRequestsByName: function(name) {
			var runRequests = [];
			for (var i = 0; i < this.length; i++) {
				if (this.at(i).get('name') === name) {
					runRequests.push(this.at(i));
				}
			}
			return runRequests;
		},

		//
		// ajax methods
		//

		fetchByAssessmentRun: function(assessmentRun, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.csa + '/assessment_runs/' + assessmentRun.get('assessment_run_uuid') + '/run_requests'
			}));
		},

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.csa + '/projects/' + project.get('project_uid') + '/run_requests/schedules'
			}));
		},

		fetchByProjects: function(projects, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.csa + '/projects/' + projects.getUuidsStr() + '/run_requests/schedules'
			}));
		},
	}, {

		//
		// static methods
		//

		fetchNumSchedulesByProject: function(project, options) {
			return $.ajax(Config.servers.csa + '/projects/' + project.get('project_uid') + '/run_requests/schedules/num', options);
		},

		fetchNumSchedulesByProjects: function(projects, options) {
			return $.ajax(Config.servers.csa + '/projects/' + projects.getUuidsStr() + '/run_requests/schedules/num', options);
		}
	});
});