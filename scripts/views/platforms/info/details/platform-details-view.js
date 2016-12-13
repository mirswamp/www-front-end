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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/platforms/info/details/platform-details.tpl',
	'registry',
	'collections/platforms/platform-versions',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/platforms/info/details/platform-profile/platform-profile-view',
	'views/platforms/info/versions/platform-versions-list/platform-versions-list-view'
], function($, _, Backbone, Marionette, Template, Registry, PlatformVersions, ConfirmView, NotifyView, ErrorView, PlatformProfileView, PlatformVersionsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			platformProfile: '#platform-profile',
			platformVersionsList: '#platform-versions-list'
		},

		//
		// methods
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch platform versions."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {
			var self = this;

			// display platform profile view
			//
			this.platformProfile.show(
				new PlatformProfileView({
					model: this.model
				})
			);

			// fetch and show platform versions
			//
			this.fetchPlatformVersions(function() {
				self.showPlatformVersions();	
			});
		},

		showPlatformVersions: function() {

			// show platform versions list view
			//
			this.platformVersionsList.show(
				new PlatformVersionsListView({
					model: this.model,
					collection: this.collection
				})
			);
		}
	});
});
