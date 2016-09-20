/******************************************************************************\
|                                                                              |
|                                   platforms.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of virtual machine platforms.          |
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
	'config',
	'models/platforms/platform',
	'collections/utilities/named-items'
], function($, _, Backbone, Config, Platform, NamedItems) {
	return NamedItems.extend({

		//
		// Backbone attributes
		//

		model: Platform,
		url: Config.servers.csa + '/platforms',

		//
		// ajax methods
		//

		fetch: function(options) {
			return this.fetchByUser(Registry.application.session.user, options);
		},

		fetchByUser: function(user, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/platforms/users/' + user.get('user_uid')
			}));
		},

		fetchAll: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/platforms/all/'
			}));
		},

		fetchPublic: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/platforms/public'
			}));
		},

		fetchProtected: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/platforms/protected/' + project.get('project_uid')
			}));
		},

		fetchByProject: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/platforms/projects/' + project.get('project_uid')
			}));
		}
	});
});