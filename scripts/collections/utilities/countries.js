/******************************************************************************\
|                                                                              |
|                                    countries.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of countries.                          |
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
	'models/utilities/country'
], function($, _, Backbone, Config, Country) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: Country,
		url: Config.servers.rws + '/countries'
	});
});