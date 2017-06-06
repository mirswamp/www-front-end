/******************************************************************************\
|                                                                              |
|                                    field.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a field of an API (JSON) data type.           |
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

		idAttribute: 'field_uuid',
		urlRoot: Config.servers.api + '/api/fields',
		
		//
		// overridden Backbone methods
		//

		isNew: function() {
			return !this.has('field_uuid');
		}
	});
});