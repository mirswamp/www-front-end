/******************************************************************************\
|                                                                              |
|                                 user-permission.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level application specific class.                |
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
	'cookie',
	'config',
	'registry',
	'models/utilities/timestamped',
	'views/dialogs/error-view'
], function($, _, Backbone, Cookie, Config, Registry, Timestamped, ErrorView) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'user_permission_uid',
		urlRoot: Config.servers.rws + '/user_permissions',

		//
		// notification methods
		//

		getDescription: function() {
			return this.get('user_full_name') + ' has requested the permission: ' + this.get('permission') + 
				(this.get('permission').endsWith('.')? '' : '.');
		},

		getNotificationHash: function() {
			return '#accounts/' + this.get('user_uid') + '/permissions';
		},

		//
		// overridden Backbone methods
		//

		url: function() {
			if (this.has('user_permission_uid')) {
				return this.urlRoot + '/' + this.get('user_permission_uid');
			} else if (this.has('user_uid') && this.has('permission_code')) {
				return this.urlRoot + '/' + this.get('user_uid') + '/' + this.get('permission_code');
			}
		}
	});
});

