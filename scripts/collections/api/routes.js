/******************************************************************************\
|                                                                              |
|                                     routes.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of api methods / routes.               |
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
	'models/api/route',
	'collections/base-collection',
], function($, _, Config, Route, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Route,
		url: Config.servers.api + '/api/routes',

		//
		// querying methods
		//

		getRoute: function(method, route) {
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				if (model.has('method')) {
					if (model.get('method').toLowerCase() == method.toLowerCase()) {
						if (model.get('route') == route) {
							return model;
						}
					}
				}
			}
		},

		//
		// ajax methods
		//

		fetchActual: function(url, server, options) {
			var self = this;

			$.ajax({
				method: 'GET',
				url: url,

				// callbacks
				//
				success: function(data) {

					// create models
					//
					for (var i = 0; i < data.length; i++) {
						var strings = data[i].split(' ');
						self.add(new Route({
							method: strings[0],
							route: strings[1],
							server: server
						}));
					}

					if (options && options.success) {
						options.success();
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch routes from " + server + " server."
					});
				}
			});
		}
	});
});