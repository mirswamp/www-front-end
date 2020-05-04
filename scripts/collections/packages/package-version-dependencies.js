/******************************************************************************\
|                                                                              |
|                      package-version-dependencies.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|    This file defines a collection of package versions dependencies.          |
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
	'models/packages/package-version-dependency',
	'collections/base-collection'
], function($, _, Config, PackageVersionDependency, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: PackageVersionDependency,

		//
		// overridden Backbone methods
		//

		url: function() {
			return Config.servers.web + '/packages/versions/dependencies';
		},

		//
		// querying methods
		//

		getPlatformVersionsUuids: function() {
			var uuids = [];
			this.each(function(item) {
				uuids.push(item.get('platform_version_uuid'));
			});
			return uuids;
		},

		getByPlatformUuid: function(platformVersionUuid) {
			
			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(item) {
				if (item.get('platform_version_uuid') == platformVersionUuid) {
					collection.add(item);
				}
			});

			return collection;
		},

		//
		// ajax methods
		//

		fetchByPackageVersion: function(packageVersionUuid, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/packages/versions/' + packageVersionUuid + '/dependencies'
			}));
		},
		
		fetchMostRecent: function(packageUuid, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/packages/' + packageUuid + '/versions/dependencies/recent'
			}));
		}
	});
});
