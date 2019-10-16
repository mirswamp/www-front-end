/******************************************************************************\
|                                                                              |
|                               platform-details-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a platforms's details info.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/platforms/info/details/platform-details.tpl',
	'collections/platforms/platform-versions',
	'views/base-view',
	'views/platforms/info/details/platform-profile/platform-profile-view',
	'views/platforms/info/versions/platform-versions-list/platform-versions-list-view'
], function($, _, Template, PlatformVersions, BaseView, PlatformProfileView, PlatformVersionsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#platform-profile',
			list: '#platform-versions-list'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new PlatformVersions();
		},

		//
		// ajax methods
		//

		fetchPlatformVersions: function(done) {
			var self = this;
			this.collection.fetchByPlatform(this.model, {

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch platform versions."
					});
				}
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// display platform profile view
			//
			this.showChildView('profile', new PlatformProfileView({
				model: this.model
			}));

			// fetch and show platform versions
			//
			this.fetchPlatformVersions(function() {
				self.showPlatformVersions();	
			});
		},

		showPlatformVersions: function() {

			// show platform versions list view
			//
			this.showChildView('list', new PlatformVersionsListView({
				model: this.model,
				collection: this.collection
			}));
		}
	});
});
