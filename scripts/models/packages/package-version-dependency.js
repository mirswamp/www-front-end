/******************************************************************************\
|                                                                              |
|                       package-version-dependency.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a version of a software package.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/utilities/timestamped',
	'models/behaviors/change-trackable'
], function($, _, Config, Timestamped, ChangeTrackable) {
	return Timestamped.extend(_.extend({}, ChangeTrackable, {

		//
		// Backbone attributes
		//

		idAttribute: 'package_version_dependency_id',
		urlRoot: Config.servers.web + '/packages/versions/dependencies',

		//
		// ajax methods
		//

		destroy: function(options) {
			return Timestamped.prototype.destroy.call(this, _.extend(options, {
				url: Config.servers.web + '/packages/versions/' + this.get('package_version_uuid') + '/dependencies/' + this.get('platform_version_uuid')
			}));
		},
	}));
});
