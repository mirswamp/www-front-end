/******************************************************************************\
|                                                                              |
|                     package-version-compatibility-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package version's                 |
|        compatibility.                                                        |
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
	'text!templates/packages/info/versions/info/compatibility/package-version-compatibility.tpl',
	'collections/packages/package-platforms',
	'views/base-view',
	'views/packages/platforms/list/package-platforms-list-view'
], function($, _, Template, PackagePlatforms, BaseView, PackagePlatformsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#package-version-platforms-list'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new PackagePlatforms();
		},

		//
		// rendering methods
		//

		onRender: function() {
			this.fetchAndShowPackageVersionPlatforms();
		},

		showPackageVersionPlatforms: function() {
			this.showChildView('list', new PackagePlatformsListView({
				collection: this.collection
			}));
		},

		fetchAndShowPackageVersionPlatforms: function() {
			var self = this;
			this.collection.fetch(this.model, {
				data: {
					package_version_uuid: this.model.get('package_version_uuid')
				},

				// callbacks
				//
				success: function() {
					self.showPackageVersionPlatforms();
				},

				error: function() {
					application.error({
						message: 'Could not fetch package version platforms.'
					});
				}
			});
		}
	});
});
