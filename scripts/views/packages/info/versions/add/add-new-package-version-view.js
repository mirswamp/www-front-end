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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/add/add-new-package-version.tpl',
	'models/utilities/version',
	'models/packages/package',
	'models/packages/package-version',
	'collections/packages/package-versions',
	'collections/packages/package-version-dependencies',
	'views/packages/info/versions/new-package-version-view'
], function($, _, Backbone, Marionette, Template, Version, Package, PackageVersion, PackageVersions, PackageVersionDependencies, NewPackageVersionView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			newPackageVersion: '#new-package-version'
		},

		//
		// methods
		//

		initialize: function() {

			// set attributes
			//
			this.packageVersionDependencies = new PackageVersionDependencies();
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				name: this.options.package.get('name'),
				package: this.options.package
			}));
		},

		onRender: function() {
			var self = this;
			this.packageVersionDependencies.fetchMostRecent(this.options.package.get('package_uuid'), {

				// callbacks
				//
				success: function() {

					// get latest package version
					//
					self.options.package.fetchLatestVersion(function(packageVersion) {
						var nextVersionString = Version.getNextVersionString(packageVersion.get('version_string'));

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
						self.newPackageVersion.show(
							new NewPackageVersionView({
								model: self.model,
								package: self.options.package,
								packageVersionDependencies: self.packageVersionDependencies
							})
						);
					});
				}
			});
		}
	});
});
