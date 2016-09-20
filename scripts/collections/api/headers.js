/******************************************************************************\
|                                                                              |
|                                   headers.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of api method headers.                 |
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
	'models/api/header',
	'collections/base-collection'
], function($, _, Backbone, Config, Header, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Header,
		url: Config.servers.api + '/api/routes/headers',

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
				})
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
				url: Config.servers.api + '/api/routes/' + route.get('route_uuid') + '/headers'
			}));	
		}
	});
});