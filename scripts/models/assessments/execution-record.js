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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
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
		urlRoot: Config.servers.web + '/execution_records',

		//
		// attributes
		//

		terminalStates: [
			'WAITING TO START',
			'FAILED TO VALIDATE ASSESSMENT DATA',
			'SUBMITTING TO HTCONDOR',
			'FAILED TO START',
			'Demand Queued',
			'Swamp Off Queued',
			'Drain ReLaunch',
			'Drain ReQueued',
			'Creating HTCondor Job',
			'Failed to submit to HTCondor',
			'Extracting Assessment Results',
			'Failed to extract assessment results',
			'Post-Processing',
			'Saving Results',
			'Finished',
			'Finished with Errors',
			'Finished with Errors - Retry',
			'Terminating',
			'Terminated'
		],
		
		//
		// querying methods
		//

		equalTo: function(model) {
			return _.isEqual(this.attributes, model.attributes);
		},

		isComplete: function() {
			return this.get('complete_flag') == true;
		},

		hasErrors: function() {
			return this.has('status') && this.get('status').toLowerCase().indexOf('errors') != -1;
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
			return this.get('vm_ready_flag') == true;
		},

		getProjectExecutionRecordsUrl: function(project) {
			return Config.servers.web + '/projects/' + project.get('project_uuid') + '/execution_records';
		},

		isKillable: function() {
			return !this.get('status').contains(this.terminalStates, false);
		},

		//
		// ajax methods
		//

		kill: function(options) {
			$.ajax(_.extend(options, {
				type: 'PUT',
				url: Config.servers.web + '/execution_records/' + this.get('execution_record_uuid') + '/kill',
				data: {
					type: this.get('type'),
					hard: options? options.hard : false
				}
			}));
		},

		getSshAccess: function(config) {
			$.ajax(_.extend(config, {
				type: 'GET',
				url: Config.servers.web + '/execution_records/' + this.get('execution_record_uuid') + '/ssh_access'
			}));
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
		}
	});
});
