/******************************************************************************\
|                                                                              |
|                              run-request-schedule.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of run request schedule's recurrence.            |
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
	'config'
], function($, _, Backbone, Config) {
	return Backbone.Model.extend({

		//
		// attributes
		//

		defaults: {
			'recurrence_type': undefined,
			'recurrence_day': undefined,
			'time_of_day': undefined
		},

		//
		// Backbone attributes
		//

		idAttribute: 'run_request_schedule_uuid',
		urlRoot: Config.servers.web + '/run_request_schedules'
	});
});