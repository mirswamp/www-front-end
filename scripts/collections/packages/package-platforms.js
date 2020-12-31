/******************************************************************************\
|                                                                              |
|                               package-platforms.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of package / platform                  |
|        (or platform version) compatibilities.                                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/packages/package-platform',
	'collections/base-collection'
], function($, _, Config, PackagePlatform, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: PackagePlatform,
		url: Config.servers.web + '/packages',

		//
		// ajax methods
		//

		fetch: function(package, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: this.url + '/' + package.get('package_uuid') + '/platforms'
			}));
		},
	});
});
