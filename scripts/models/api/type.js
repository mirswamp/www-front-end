/******************************************************************************\
|                                                                              |
|                                    type.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an API (JSON) data type.                      |
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
	'config',
	'registry',
	'models/utilities/timestamped'
], function($, _, Config, Registry, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'type_uuid',
		urlRoot: Config.servers.api + '/api/types',
		
		//
		// ajax methods
		//

		fetchByName: function(name, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: this.urlRoot + '/names/' + name
			}));
		},

		//
		// overridden Backbone methods
		//

		isNew: function() {
			return !this.has('type_uuid');
		}
	});
});