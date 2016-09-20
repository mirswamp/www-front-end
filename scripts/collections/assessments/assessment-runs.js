/******************************************************************************\
|                                                                              |
|                                assessment-runs.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of assessment runs.                    |
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
	'models/assessments/assessment-run',
	'collections/base-collection'
], function($, _, Backbone, Config, AssessmentRun, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: AssessmentRun,

		//
		// ajax methods
		//

		fetchByProject: function(project, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/projects/' + project.get('project_uid') + '/assessment_runs'
			}));
		},

		fetchByProjects: function(projects, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/projects/' + projects.getUuidsStr() + '/assessment_runs'
			}));
		},

		//
		// uuid handling methods
		//

		getUuids: function() {
			var uuids = [];
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				uuids.push(model.get('assessment_run_uuid'));
			}
			return uuids;
		},

		getUuidsStr: function() {
			return this.uuidsArrayToStr(this.getUuids());
		},

		uuidsArrayToStr: function(uuids) {
			var str = '';
			for (var i = 0; i < uuids.length; i++) {
				if (i > 0) {
					str += '+';
				}
				str += uuids[i];
			}
			return str;		
		},

		uuidsStrToArray: function(str) {
			return str.split('+');
		}
	}, {

		//
		// static methods
		//

		fetchNumByProject: function(project, options) {
			return $.ajax(Config.servers.csa + '/projects/' + project.get('project_uid') + '/assessment_runs/num', options);
		},

		fetchNumByProjects: function(projects, options) {
			return $.ajax(Config.servers.csa + '/projects/' + projects.getUuidsStr() + '/assessment_runs/num', options);
		}
	});
});