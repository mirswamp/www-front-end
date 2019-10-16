/******************************************************************************\
|                                                                              |
|                                     country.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a country's ISO and phone information.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/base-model'
], function($, _, Config, BaseModel) {
	return BaseModel.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'country_id',
		urlRoot: Config.servers.web + '/countries'
	});
});