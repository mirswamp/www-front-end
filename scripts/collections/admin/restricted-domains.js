/******************************************************************************\
|                                                                              |
|                               restricted-domains.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of restricted domains.                 |
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
	'models/admin/restricted-domain',
	'collections/base-collection'
], function($, _, Backbone, Config, RestrictedDomain, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: RestrictedDomain,
		url: Config.servers.web + '/restricted-domains'
	});
});