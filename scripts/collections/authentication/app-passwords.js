/******************************************************************************\
|                                                                              |
|                                app-passwords.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of application passwords.              |
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
	'models/authentication/app-password',
	'collections/base-collection'
], function($, _, Config, AppPassword, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: AppPassword,
		urlRoot: Config.servers.web + '/v1/app_passwords',

		//
		// ajax methods
		//

		fetch: function(options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: this.urlRoot
			}));
		},

		deleteAll: function(options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				type: 'DELETE',
				url: Config.servers.web + '/v1/app_passwords'
			}));
		},

		//
		// admin ajax methods
		//

		fetchByUser: function(user, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/v1/admin/users/' + user.get('user_uid') + '/app_passwords'
			}));
		},

		deleteByUser: function(user, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				type: 'DELETE',
				url: Config.servers.web + '/v1/admin/users/' + user.get('user_uid') + '/app_passwords'
			}));
		}
	});
});
