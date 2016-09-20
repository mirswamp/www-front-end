/******************************************************************************\
|                                                                              |
|                                assessment-run.js                             |
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

		idAttribute: 'assessment_run_uuid',
		urlRoot: Config.servers.csa + '/assessment_runs',

		//
		// ajax methods
		//

		checkCompatibility: function(options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/check_compatibility',
				type: 'POST'
			}));
		}
	});
});
