/******************************************************************************\
|                                                                              |
|                                package-versions.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of package versions.                   |                                                  |
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
	'models/packages/package-version',
	'collections/utilities/versions'
], function($, _, Backbone, Config, PackageVersion, Versions) {
	return Versions.extend({

		//
		// Backbone attributes
		//

		model: PackageVersion,

		//
		// ajax methods
		//

		fetchByPackage: function(package, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/packages/' + package.get('package_uuid') + '/versions'
			}));
		},

		fetchAvailableByPackage: function(package, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/packages/' + package.get('package_uuid') + '/versions/available'
			}));
		},

		fetchByPackageProject: function(package, project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/packages/' + package.get('package_uuid') + '/' + project.get('project_uid') + '/versions'
			}));
		},

		fetchByPackageProjects: function(package, projects, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/packages/' + package.get('package_uuid') + '/' + projects.getUuidsStr() + '/versions'
			}));
		},

		//
		// sorting methods
		//

		sort: function(options) {

			// sort by version string
			//
			this.sortByAttribute('version_string', _.extend(options || {}, {
				comparator: function(versionString) {
					return PackageVersion.comparator(versionString);
				}
			}));
		},

		sorted: function(options) {

			// sort by version string
			//
			return this.sortedByAttribute('version_string', _.extend(options || {}, {
				comparator: function(versionString) {
					return PackageVersion.comparator(versionString);
				}		
			}));
		}
	});
});
