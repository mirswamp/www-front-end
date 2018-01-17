/******************************************************************************\
|                                                                              |
|                                package-type.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a type (language) of software package.        |
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
	'models/utilities/timestamped'
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		urlRoot: Config.servers.web + '/packages/types',

		//
		// querying methods
		//

		isEnabled: function() {
			return this.get('package_type_enabled') == 1;
		},

		isUserSelectable: function() {
			return this.get('platform_user_selectable') == 1;
		}
	});
});
