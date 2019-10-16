/******************************************************************************\
|                                                                              |
|                                 scheduled-runs.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of scheduled assessment runs.          |
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
	'config',
	'models/assessments/scheduled-run',
	'collections/run-requests/run-requests',
	'collections/assessments/assessment-runs'
], function($, _, Config, ScheduledRun, RunRequests, AssessmentRuns) {
	return AssessmentRuns.extend({

		//
		// Backbone attributes
		//

		model: ScheduledRun,

		//
		// querying methods
		//

		get: function(model) {

			// override default collection behavior to look for
			// exact model instead of model with the same id
			//
			for (var i = 0; i < this.length; i++) {
				if (this.at(i) == model) {
					return model;
				}
			}
		},

		getRunRequests: function() {
			var collection = new RunRequests();
			for (var i = 0; i < this.length; i++) {
				var scheduledRun = this.at(i);
				var runRequest = scheduledRun.get('run_request');
				if (!collection.contains(runRequest)) {
					collection.add(runRequest);
				}
			}
			return collection;
		},

		getByRunRequest: function(runRequest) {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			for (var i = 0; i < this.length; i++) {
				var scheduledRun = this.at(i);
				if (runRequest.isSameAs(scheduledRun.get('run_request'))) {
					collection.add(scheduledRun);
				}
			}
			return collection;
		},

		getByRunRequests: function(runRequests) {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			for (var i = 0; i < runRequests.length; i++) {
				collection.add(new Backbone.Model({
					'run_request': runRequests.at(i),
					'collection': this.getByRunRequest(runRequests.at(i))
				}), {
					at: 0
				});
			}
			return collection;
		},
		
		//
		// ajax methods
		//

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/projects/' + project.get('project_uid') + '/assessment_runs/scheduled'
			}));
		},

		fetchByProjects: function(projects, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/projects/' + projects.getUuidsStr() + '/assessment_runs/scheduled'
			}));
		},
	}, {

		//
		// static methods
		//

		fetchNumByProject: function(project, options) {
			return $.ajax(Config.servers.web + '/projects/' + project.get('project_uid') + '/assessment_runs/scheduled/num', options);
		},

		fetchNumByProjects: function(projects, options) {
			return $.ajax(Config.servers.web + '/projects/' + projects.getUuidsStr() + '/assessment_runs/scheduled/num', options);
		}
	});
});