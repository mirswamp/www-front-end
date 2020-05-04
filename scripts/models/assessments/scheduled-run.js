/******************************************************************************\
|                                                                              |
|                                scheduled-run.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a single software assessment run.             |
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
	'models/assessments/assessment-run',
	'models/run-requests/run-request',
], function($, _, Config, AssessmentRun, RunRequest) {
	return AssessmentRun.extend({

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			AssessmentRun.prototype.parse.call(this, response);

			// parse run request
			//
			if (response.run_request) {
				response.run_request = new RunRequest(response.run_request);
			}

			return response;
		},
	});
});
