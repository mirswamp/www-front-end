/******************************************************************************\
|                                                                              |
|                                     admin.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a system administrator role.                  |
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
	'config',
	'models/utilities/timestamped'
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		urlRoot: Config.servers.web + '/admins',

		//
		// overridden Backbone methods
		//

		url: function() {
			return this.urlRoot + '/' + this.get('user_uid');
		},

		isNew: function() {
			return !this.has('admin_id');
		}
	});
});