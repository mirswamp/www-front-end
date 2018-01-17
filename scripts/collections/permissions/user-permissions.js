/******************************************************************************\
|                                                                              |
|                              user-permissions.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user permissions.                   |
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
	'backbone',
	'config',
	'models/permissions/user-permission'
], function($, _, Backbone, Config, UserPermission) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: UserPermission,

		//
		// ajax methods
		//

		fetchByUser: function(user, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/users/' + user.get('user_uid') + '/permissions'
			}));
		},

		fetchPending: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/admin/permissions'
			}));		
		}
	}, {

		//
		// static methods
		//

		fetchNumPending: function(options) {
			return $.ajax(Config.servers.web + '/admin/permissions/num', options);
		},
	});
});
