/******************************************************************************\
|                                                                              |
|                                   responses.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of api method responses.               |
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
	'models/api/response',
	'collections/base-collection'
], function($, _, Config, Response, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Response,
		url: Config.servers.api + '/api/routes/responses',

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
				var model = this.at(i);
				model.set({
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
				url: Config.servers.api + '/api/routes/' + route.get('route_uuid') + '/responses'
			}));	
		}
	});
});