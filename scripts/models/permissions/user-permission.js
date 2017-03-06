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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
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
		urlRoot: Config.servers.web + '/user_permissions',

		//
		// notification methods
		//

		getDescription: function() {
			var name = this.has('user_full_name')? this.get('user_full_name') : '?';
			var permission = this.has('permission')? this.get('permission') : '?';

			return name + ' has requested the permission: ' + permission + 
				(permission.endsWith('.')? '' : '.');
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
		},

		parse: function(response) {

			// call superclass method
			//
			var json = Timestamped.prototype.parse.call(this, response);

			// parse subfields
			//
			if (json.meta_information) {
				json.meta_information = JSON.parse(json.meta_information);
			}

			return json;
		},
	}, {

		//
		// static attributes
		//

		restrictedPermissions: [
			'parasoft-user-c-test',
			'parasoft-user-j-test',
			'parasoft-user-j-test',
			'red-lizard-user',
			'codesonar-user'
		]
	});
});