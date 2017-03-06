/******************************************************************************\
|                                                                              |
|                               execution-records.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of execution records.                  |
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
	'backbone',
	'config',
	'models/assessments/execution-record',
	'collections/base-collection'
], function($, _, Backbone, Config, ExecutionRecord, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: ExecutionRecord,

		//
		// ajax methods
		//

		fetchAll: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/execution_records/all'
			}));
		},

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/projects/' + project.get('project_uid') + '/execution_records'
			}));
		},

		fetchByProjects: function(projects, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/projects/' + projects.getUuidsStr() + '/execution_records'
			}));
		},
	}, {

		//
		// static methods
		//

		fetchNumByProject: function(project, options) {
			return $.ajax(Config.servers.web + '/projects/' + project.get('project_uid') + '/execution_records/num', options);
		},

		fetchNumByProjects: function(projects, options) {
			return $.ajax(Config.servers.web + '/projects/' +  projects.getUuidsStr() + '/execution_records/num', options);
		},		
	});
});