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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/add/add-new-package.tpl',
	'registry',
	'models/packages/package',
	'models/packages/package-version',
	'collections/packages/package-version-dependencies',
	'views/dialogs/error-view',
	'views/packages/new-package-view'
], function($, _, Backbone, Marionette, Template, Registry, Package, PackageVersion, PackageVersionDependencies, ErrorView, NewPackageView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			newPackage: '#new-package'
		},

		//
		// methods
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {

			// display new package view
			//
			this.newPackage.show(
				new NewPackageView({
					model: this.model,
					packageVersion: this.packageVersion,
					packageVersionDependencies: this.packageVersionDependencies
				})
			);
		}
	});
});
