/******************************************************************************\
|                                                                              |
|                                  auth-provider.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model for federated authentication providers.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config'
], function($, _, Backbone, Config) {
	return Backbone.Model.extend({

		//
		// Backbone attributes
		//

		urlRoot: Config.servers.web + '/idps'
	});
});
