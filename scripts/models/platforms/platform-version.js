/******************************************************************************\
|                                                                              |
|                                platform-version.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a version of an operating system platform.               |
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
	'config',
	'models/utilities/shared-version',
	'views/dialogs/error-view'
], function($, _, Config, SharedVersion, ErrorView) {
	var Class = SharedVersion.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'platform_version_uuid',
		urlRoot: Config.servers.web + '/platforms/versions'
	}, {

		//
		// static methods
		//

		fetch: function(platformVersionUuid, done) {

			// fetch platform version
			//
			var platformVersion = new Class({
				platform_version_uuid: platformVersionUuid
			});

			platformVersion.fetch({

				// callbacks
				//
				success: function() {
					done(platformVersion);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch platform version."
						})
					);
				}
			});
		}
	});

	return Class;
});