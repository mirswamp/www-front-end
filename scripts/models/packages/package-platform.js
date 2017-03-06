/******************************************************************************\
|                                                                              |
|                              package-platform.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of package compatibility with platforms          |
|        and platform versions.                                                |
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
	'models/utilities/timestamped',
	'models/packages/package',
	'models/platforms/platform',
	'models/platforms/platform-version'
], function($, _, Config, Registry, Timestamped, Package, Platform, PlatformVersion) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'package_platform_id',

		//
		// overridden Backbone methods
		//

		parse: function(data) {

			// convert package and platform / platform version
			//
			if (data.package) {
				data.package = new Package(data.package);
			}
			if (data.platform) {
				data.platform = new Platform(data.platform);
			}
			if (data.platform_version) {
				data.platform_version = new PlatformVersion(data.platform_version);
			}

			return data;
		}
	});
});
