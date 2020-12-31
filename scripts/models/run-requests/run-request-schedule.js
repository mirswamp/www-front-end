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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/base-model'
], function($, _, Config, BaseModel) {
	return BaseModel.extend({

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