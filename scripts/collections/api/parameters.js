/******************************************************************************\
|                                                                              |
|                                   parameters.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of api method parameters.              |
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
	'models/api/parameter',
	'collections/base-collection'
], function($, _, Config, Parameter, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Parameter,
		url: Config.servers.api + '/api/routes/parameters',

		//
		// methods
		//

		setRoute: function(route) {
			var routeUuid = route.get('route_uuid');
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				model.set({
					route_uuid: routeUuid
				});
			}
		},

		reorder: function() {
			for (var i = 0; i < this.length; i++) {
				this.at(i).set({
					order: i + 1
				});
			}
		},

		//
		// querying methods
		//

		getKeyValueArray: function() {
			var array = {};
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				var key = model.get('name');
				array[key] = undefined;
			}
			return array;
		},

		//
		// ajax methods
		//

		fetchByRoute: function(route, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.api + '/api/routes/' + route.get('route_uuid') + '/parameters'
			}));	
		}
	});
});