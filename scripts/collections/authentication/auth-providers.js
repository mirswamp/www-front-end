/******************************************************************************\
|                                                                              |
|                                auth-providers.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection federated authentication providers.    |
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
	'models/authentication/auth-provider'
], function($, _, Backbone, Config, AuthProvider) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: AuthProvider,

		//
		// ajax methods
		//

		fetch: function(options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.rws + '/idps'
			}));
		}
	});
});
