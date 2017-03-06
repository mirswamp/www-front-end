/******************************************************************************\
|                                                                              |
|                       package-compatibility-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package's compatibility.          |
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
	'backbone',
	'marionette',
	'text!templates/packages/info/compatibility/package-compatibility.tpl',
	'collections/packages/package-platforms',
	'views/packages/platforms/list/package-platforms-list-view'
], function($, _, Backbone, Marionette, Template, PackagePlatforms, PackagePlatformsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			packagePlatformsList: '#package-platforms-list'
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
			this.fetchAndShowPackagePlatforms();
		},

		showPackagePlatforms: function() {
			this.packagePlatformsList.show(new PackagePlatformsListView({
				collection: this.collection
			}));
		},

		fetchAndShowPackagePlatforms: function() {
			var self = this;
			this.collection.fetch(this.model, {

				// callbacks
				//
				success: function() {
					self.showPackagePlatforms();
				},

				error: function() {
					application.error({
						message: 'Could not fetch package platforms.'
					})
				}
			});
		}
	});
});
