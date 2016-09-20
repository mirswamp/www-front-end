/******************************************************************************\
|                                                                              |
|                               platform-versions.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of platform versions.                  |                                                  |
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
	'models/platforms/platform-version',
	'collections/utilities/versions'
], function($, _, Backbone, Config, PlatformVersion, Versions) {
	return Versions.extend({

		//
		// Backbone attributes
		//

		model: PlatformVersion,

		//
		// ajax methods
		//

		fetchAll: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.csa + '/platforms/versions/all'
			}));
		},

		fetchByPlatform: function(platform, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.csa + '/platforms/' + platform.get('platform_uuid') + '/versions'
			}));
		}
	});
});
