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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/utilities/country',
	'collections/base-collection'
], function($, _, Config, Country, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Country,
		url: Config.servers.web + '/countries'
	});
});