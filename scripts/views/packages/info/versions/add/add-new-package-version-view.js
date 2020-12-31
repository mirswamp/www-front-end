/******************************************************************************\
|                                                                              |
|                          add-new-package-version-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view used to add / upload new package versions.      |
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
	'text!templates/packages/info/versions/add/add-new-package-version.tpl',
	'models/utilities/version',
	'models/packages/package',
	'models/packages/package-version',
	'collections/packages/package-versions',
	'collections/packages/package-version-dependencies',
	'views/base-view',
	'views/packages/info/versions/new-package-version-view'
], function($, _, Template, Version, Package, PackageVersion, PackageVersions, PackageVersionDependencies, BaseView, NewPackageVersionView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			version: '#new-package-version'
		},

		//
		// constructor
		//

		initialize: function() {

			// set attributes
			//
			this.packageVersionDependencies = new PackageVersionDependencies();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				name: this.options.package.get('name'),
				url: this.options.package.getAppUrl(),
			};
		},

		onRender: function() {
			var self = this;
			this.packageVersionDependencies.fetchMostRecent(this.options.package.get('package_uuid'), {

				// callbacks
				//
				success: function(collection) {

					// make dependencies new
					//
					for (var i = 0; i < collection.length; i++) {
						collection.at(i).set({
							'package_version_dependency_id': undefined
						});
					}

					// get latest package version
					//
					self.options.package.fetchLatestVersion(function(packageVersion) {
						
						// find next package version string
						//
						var nextVersionString = Version.getNextVersionString(packageVersion? packageVersion.get('version_string') : null);

						// create next version
						//
						self.model = new PackageVersion({
							'version_string': nextVersionString,
							'package_uuid': self.options.package.get('package_uuid'),
							'external_url': self.options.package.get('external_url'),
							'version_sharing_status': 'private'
						});

						// display new package version view
						//
						self.showChildView('version', new NewPackageVersionView({
							model: self.model,
							package: self.options.package,
							packageVersionDependencies: collection
						}));
					});
				}
			});
		}
	});
});
