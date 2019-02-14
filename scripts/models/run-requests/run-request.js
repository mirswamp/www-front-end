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
	'backbone',
	'config',
	'registry',
	'models/base-model',
	'models/tools/tool',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
], function($, _, Backbone, Config, Registry, BaseModel, Tool, NotifyView, ErrorView) {
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

					// show notify dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "The owner of this project must request permission to use \"" + response.tool_name + ".\""
						})
					);
					break;

				case 'tool_no_permission':

					// show notify dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "You do not have permission to use \"" + response.tool_name + ".\""
						})
					);
					break;

				case 'no_project':

					// show notify dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "The project owner has not designated \"" + response.project_name + "\" for use with \"" + response.tool_name + ".\" To do so the project owner must add an assessment which uses \"" + response.tool_name + ".\""
						})
					);
					break;

				case 'no_policy':
					var tool = new Tool(response.tool);

					// fetch tool policy text
					//
					tool.fetchPolicy({

						// callbacks
						//
						success: function(policy) {

							// show confirm tool policy dialog
							//
							tool.confirmToolPolicy({
								policy_code: response.policy_code,
								policy: policy,

								// callbacks
								//
								success: function() {

									// perform callback
									//
									if (options && options.success) {
										options.success();
									}
								},

								reject: function() {

									// perform callback
									//
									if (options && options.reject) {
										options.reject();
									}		
								},

								error: function(response) {

									// show error dialog
									//
									Registry.application.modal.show(
										new ErrorView({
											message: "Error saving policy acknowledgement."
										})
									);
								}
							});
						},

						error: function() {

							// show error dialog
							//
							Registry.application.modal.show(
								new ErrorView({
									message: "Could not fetch tool policy."
								})
							);
						}
					});
					break;

				case 'NO_SESSION':

					// log in
					//
					Registry.application.sessionExpired();
					break;

				case 403:
					Registry.application.modal.show(
						new NotifyView({
							message: "Permissions error.  You do not have permissions to view information from this project."
						})
					);	
					break;

				default:

					// show error dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "Could not fetch run request."
						})
					);
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
