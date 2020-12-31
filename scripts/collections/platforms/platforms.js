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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/platforms/platform',
	'collections/utilities/named-items'
], function($, _, Config, Platform, NamedItems) {
	return NamedItems.extend({

		//
		// Backbone attributes
		//

		model: Platform,
		url: Config.servers.web + '/platforms',

		//
		// filtering methods
		//

		getByTool: function(tool) {
			var platformNames = tool.get('platform_names');

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(platform, index, list) {
				if (platformNames.contains(platform.get('name'))) {
					collection.push(platform);
				}
			});

			return collection;
		},

		//
		// ajax methods
		//

		fetch: function(options) {
			return this.fetchByUser(application.session.user, options);
		},

		fetchByUser: function(user, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/platforms/users/' + user.get('user_uid')
			}));
		},

		fetchAll: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/platforms/all/'
			}));
		},

		fetchPublic: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/platforms/public'
			}));
		},

		fetchProtected: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/platforms/protected/' + project.get('project_uid')
			}));
		},

		fetchByProject: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/platforms/projects/' + project.get('project_uid')
			}));
		}
	});
});