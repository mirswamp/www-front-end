/******************************************************************************\
|                                                                              |
|                                   platform.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a software platform for packages and          |
|        tools.                                                                |
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
	'config',
	'models/utilities/timestamped',
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'platform_uuid',
		urlRoot: Config.servers.web + '/platforms',

		//
		// querying methods
		//

		isOwned: function() {
			return this.isOwnedBy(application.session.user);		
		},

		isOwnedBy: function(user) {
			return (user && this.get('platform_owner_uuid') === user.get('user_uid'));
		},

		isDeactivated: function() {
			return (this.hasDeleteDate());
		},

		getUploadUrl: function() {
			return this.urlRoot + '/upload';
		},

		getSharingUrl: function() {
			return this.urlRoot + '/' + this.get('platform_uuid') + '/sharing';
		},

		supports: function(tool) {
			var platformNames = tool.get('platform_names');
			if (platformNames) {
				return (platformNames.indexOf(this.get('name')) != -1);
			}
		},

		//
		// scoping methods
		//

		isPublic: function() {
			return this.has('platform_sharing_status') &&
				this.get('platform_sharing_status').toLowerCase() === 'pubic';
		},

		isPrivate: function() {
			return this.has('platform_sharing_status') &&
				this.get('platform_sharing_status').toLowerCase() === 'private';
		},

		isProtected: function() {
			return this.has('platform_sharing_status') &&
				this.get('platform_sharing_status').toLowerCase() === 'protected';
		}
	}, {

		//
		// static methods
		//

		fetch: function(platformUuid, done) {

			// fetch platform
			//
			var platform = new this.prototype.constructor({
				platform_uuid: platformUuid
			});

			platform.fetch({

				// callbacks
				//
				success: function() {
					done(platform);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch platform."
					});
				}
			});
		}
	});
});