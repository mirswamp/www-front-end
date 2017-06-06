/******************************************************************************\
|                                                                              |
|                                     fields.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of api (JSON) data type fields.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'models/api/field',
	'collections/base-collection'
], function($, _, Backbone, Config, Field, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Field,
		url: Config.servers.api + '/api/fields',

		//
		// ajax methods
		//

		fetchByType: function(type, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.api + '/api/types/' + type.get('type_uuid') + '/fields'
			}));	
		}
	});
});