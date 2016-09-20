/******************************************************************************\
|                                                                              |
|                              run-request-schedules.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a collection of assessment run request schedules.        |
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
	'models/run-requests/run-request-schedule'
], function($, _, Backbone, Config, RunRequestSchedule) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: RunRequestSchedule,
		url: Config.servers.csa + '/run_request_schedules',

		//
		// ajax methods
		//

		fetchByRunRequest: function(runRequest, options) {
			return this.fetch(_.extend(options, {
				url: this.url + '/run_requests/' + runRequest.get('run_request_uuid')
			}));
		},

		// allow bulk saving
		//
		save: function(options) {
			this.sync('update', this, options);
		}
	});
});