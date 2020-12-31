/******************************************************************************\
|                                                                              |
|                               add-new-package-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view used to add / upload new packages.              |
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
	'text!templates/packages/add/add-new-package.tpl',
	'models/packages/package',
	'models/packages/package-version',
	'collections/packages/package-version-dependencies',
	'views/base-view',
	'views/packages/new-package-view'
], function($, _, Template, Package, PackageVersion, PackageVersionDependencies, BaseView, NewPackageView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			new_package: '#new-package'
		},

		//
		// constructor
		//

		initialize: function() {
			this.model = new Package({
				'package_sharing_status': 'private'
			});
			this.packageVersion = new PackageVersion({
				'version_string': '1.0',
				'version_sharing_status': 'private'
			});

			this.packageVersionDependencies = new PackageVersionDependencies();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model
			};
		},

		onRender: function() {

			// display new package view
			//
			this.showChildView('new_package', new NewPackageView({
				model: this.model,
				packageVersion: this.packageVersion,
				packageVersionDependencies: this.packageVersionDependencies
			}));
		}
	});
});
