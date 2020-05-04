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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/utilities/shared-version',
], function($, _, Config, SharedVersion) {
	return SharedVersion.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'platform_version_uuid',
		urlRoot: Config.servers.web + '/platforms/versions',

		//
		// querying methods
		//

		getAppUrl: function() {
			return application.getURL() + '#platforms/versions' + this.get('platform_version_uuid');
		}
	}, {

		//
		// static methods
		//

		fetch: function(platformVersionUuid, done) {

			// fetch platform version
			//
			var platformVersion = new this.prototype.constructor({
				platform_version_uuid: platformVersionUuid
			});

			platformVersion.fetch({

				// callbacks
				//
				success: function() {
					done(platformVersion);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch platform version."
					});
				}
			});
		}
	});
});