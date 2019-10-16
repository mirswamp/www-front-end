/******************************************************************************\
|                                                                              |
|                                 platform-router.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for platform routes.         |
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
	'routers/base-router'
], function($, _, BaseRouter) {

	// create router
	//
	return BaseRouter.extend({

		//
		// route definitions
		//

		routes: {

			// platforms routes
			//
			'platforms/public': 'showPublicPlatforms',

			// platform routes
			//
			'platforms/:platform_uuid': 'showPlatform',

			// platform version routes
			//
			'platforms/versions/:platform_version_uuid': 'showPlatformVersion',
		},

		//
		// platforms route handlers
		//

		showPublicPlatforms: function() {
			require([
				'views/platforms/public-platforms-view'
			], function (PublicPlatformsView) {

				// show public platforms view
				//
				application.showMain(new PublicPlatformsView(), {
					nav: 'resources'
				});
			});
		},

		//
		// platform route helper functions
		//

		showPlatformView: function(platformUuid, options) {
			var self = this;
			require([
				'models/platforms/platform',
				'views/platforms/platform-view'
			], function (Platform, PlatformView) {
				Platform.fetch(platformUuid, function(platform) {

					// check if user is logged in
					//
					if (application.session.user) {

						// show content view
						//
						application.showContent({
							nav1: platform.isOwned()? 'home' : 'resources',
							nav2: platform.isOwned()? 'platforms' : undefined, 

							// callbacks
							//	
							done: function(view) {

								// show platform
								//
								view.showChildView('content', new PlatformView({
									model: platform,
									nav: options.nav,
									parent: view
								}));

								// perform callback
								//
								if (options.done) {
									options.done(view.getChildView('content'));
								}				
							}					
						});
					} else {

						// show single column platform view
						//
						application.showMain(new PlatformView({
							model: package,
							nav: options.nav
						}), {
							done: options.done
						});
					}
				});
			});
		},

		//
		// platform route handlers
		//

		showPlatform: function(platformUuid) {
			var self = this;
			require([
				'views/platforms/info/details/platform-details-view'
			], function (PlatformDetailsView) {

				// show platform view
				//
				self.showPlatformView(platformUuid, {
					nav: 'details',

					// callbacks
					//
					done: function(view) {

						// show platform details view
						//
						view.showChildView('info', new PlatformDetailsView({
							model: view.model
						}));
					}
				});
			});
		},

		//
		// platform version route handlers
		//

		showPlatformVersion: function(platformVersionUuid, options) {
			var self = this;
			require([
				'models/platforms/platform',
				'models/platforms/platform-version',
				'views/platforms/info/versions/platform-version/platform-version-view'
			], function (Platform, PlatformVersion, PlatformVersionView) {
				PlatformVersion.fetch(platformVersionUuid, function(platformVersion) {
					Platform.fetch(platformVersion.get('platform_uuid'), function(platform) {

						// check if user is logged in
						//
						if (application.session.user) {

							// show content view
							//
							application.showContent({
								nav1: platform.isOwned()? 'home' : 'resources',
								nav2: platform.isOwned()? 'platforms' : undefined, 

								// callbacks
								//	
								done: function(view) {

									// show platform version
									//
									view.showChildView('content', new PlatformVersionView({
										model: platformVersion,
										platform: platform,
										parent: view
									}));

									// perform callback
									//
									if (options && options.done) {
										options.done(view.getChildView('content'));
									}				
								}					
							});
						} else {

							// show single column package version view
							//
							application.showMain(new PlatformVersionView({
								model: platformVersion,
								platform: platform
							}), {
								done: options.done
							});
						}
					});
				});
			});
		},
	});
});