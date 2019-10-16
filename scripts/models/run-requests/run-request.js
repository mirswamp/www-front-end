/******************************************************************************\
|                                                                              |
|                                  run-request.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a software assessment run request.            |
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
	'models/base-model',
	'models/permissions/user-policy'
], function($, _, Config, BaseModel, UserPolicy) {
	return BaseModel.extend({

		//
		// attributes
		//

		defaults: {
			'name': undefined,
			'description': undefined,
		},

		//
		// Backbone attributes
		//

		idAttribute: 'run_request_uuid',
		urlRoot: Config.servers.web + '/run_requests',
		
		//
		// ajax methods
		//

		saveOneTimeRunRequests: function(assessmentRunUuids, notifyWhenComplete, options) {
			var self = this;
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/one-time',
				type: 'POST',
				dataType:'json',
				data: {
					'notify-when-complete': notifyWhenComplete,
					'assessment-run-uuids': assessmentRunUuids
				},

				// callbacks
				//
				error: function(res) {
					self.handleError(res);
				}
			}));
		},

		saveRunRequests: function(assessmentRunUuids, notifyWhenComplete, options){
			var self = this;
			$.ajax(_.extend(options, {
				url: this.url(),
				type: 'POST',
				dataType:'json',
				data: {
					'notify-when-complete': notifyWhenComplete,
					'assessment-run-uuids': assessmentRunUuids
				},

				// callbacks
				//
				error: function(res) {
					self.handleError(res);
				}
			}));
		},

		handleError: function(response, options) {

			// parse JSON response
			//
			if (response && response.responseText) {
				if (response.responseText.contains('{')) {
					try {
						response = JSON.parse(response.responseText);
					} catch(error) {
					}
				}
			}

			switch (response.status) {

				case 'owner_no_permission':

					// show notification
					//
					application.notify({
						message: "The owner of this project must request permission to use \"" + response.tool_name + ".\""
					});
					break;

				case 'tool_no_permission':

					// show notification
					//
					application.notify({
						message: "You do not have permission to use \"" + response.tool_name + ".\""
					});
					break;

				case 'no_project':

					// show notification
					//
					application.notify({
						message: "The project owner has not designated \"" + response.project_name + "\" for use with \"" + response.tool_name + ".\" To do so the project owner must add an assessment which uses \"" + response.tool_name + ".\""
					});
					break;

				case 'no_policy':

					// ensure the user has permission and has accepted any pertinent EULAs
					//
					new UserPolicy({
						policy_code: response.policy_code
					}).confirm(options);
					break;

				case 'NO_SESSION':

					// log in
					//
					application.sessionExpired();
					break;

				case 403:
					application.notify({
						message: "Permissions error.  You do not have permissions to view information from this project."
					});	
					break;

				default:

					// show error message
					//
					application.notify({
						message: "Could not fetch run request."
					});
					break;
			}
		},

		deleteRunRequest: function(assessmentRun, options) {
			$.ajax(_.extend(options, {
				url: this.url() + '/assessment_runs/' + assessmentRun.get('assessment_run_uuid'),
				type:'DELETE'
			}));
		}
	});
});
