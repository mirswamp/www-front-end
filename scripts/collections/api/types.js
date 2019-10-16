/******************************************************************************\
|                                                                              |
|                                    types.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of api (JSON) data types.              |
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
	'models/api/type',
	'collections/base-collection'
], function($, _, Config, Type, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Type,
		url: Config.servers.api + '/api/types'
	});
});