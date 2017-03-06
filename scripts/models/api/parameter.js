/******************************************************************************\
|                                                                              |
|                                 parameter.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an API route or method parameter.             |
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
	'models/utilities/timestamped',
	'models/behaviors/change-trackable'
], function($, _, Config, Timestamped, ChangeTrackable) {
	return Timestamped.extend(_.extend(_.extend({}, ChangeTrackable), {

		//
		// Backbone attributes
		//

		idAttribute: 'parameter_uuid',
		urlRoot: Config.servers.api + '/api/routes/parameters',
		primitiveTypes: ['string', 'uuid', 'boolean', 'integer', 'number', 'file'],

		//
		// querying methods
		//

		isPrimitiveType: function() {
			return this.primitiveTypes.indexOf(this.get('type')) != -1;
		},

		//
		// overridden Backbone methods
		//

		isNew: function() {
			return !this.has('parameter_uuid');
		}
	}));
});