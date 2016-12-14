/******************************************************************************\
|                                                                              |
|                                   route.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an API route or method.                       |
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
	'registry',
	'models/utilities/timestamped'
], function($, _, Config, Registry, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'route_uuid',
		urlRoot: Config.servers.api + '/api/routes',
		
		//
		// overridden Backbone methods
		//

		isNew: function() {
			return !this.has('route_uuid');
		}
	}, {

		//
		// static methods
		//

		fetchCategories: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.api + '/api/routes/categories',
				type: 'GET'
			}));
		}
	});
});