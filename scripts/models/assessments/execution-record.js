/******************************************************************************\
|                                                                              |
|                                 execution-record.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an execution record.                          |
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
	'config',
	'models/utilities/timestamped'
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'execution_record_uuid',
		urlRoot: Config.servers.csa + '/execution_records',
		
		//
		// querying methods
		//

		hasErrors: function() {
			return this.get('status').indexOf('errors') != -1;
		},

		hasResults: function() {
			return this.has('assessment_result_uuid');
		},

		hasWeaknesses: function() {
			if (this.has('weakness_cnt')) {
				return this.get('weakness_cnt') != 0 || Config.options.assessments.allow_viewing_zero_weaknesses;
			} else {
				return false;
			}
		},

		isVmReady: function() {
			return this.get('vm_ready_flag') == '1';
		},

		getProjectExecutionRecordsUrl: function(project) {
			return Config.servers.csa + '/projects/' + project.get('project_uuid') + '/execution_records';
		},

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			response = Timestamped.prototype.parse.call(this, response);

			// convert dates from strings to objects
			//
			if (response.run_date) {
				response.run_date = new Date(Date.parseIso8601(response.run_date));
			}
			if (response.completion_date) {
				response.completion_date = new Date(Date.parseIso8601(response.completion_date));
			}

			return response;
		},

		getSshAccess: function( config ){
			$.ajax( _.extend( config, {
				type: 'GET',
				url: Config.servers.csa + '/execution_records/' + this.get('execution_record_uuid') + '/ssh_access'
			}));
		}
	});
});
