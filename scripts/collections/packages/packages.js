/******************************************************************************\
|                                                                              |
|                                    packages.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of packages.                           |
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
	'models/packages/package',
	'collections/utilities/named-items'
], function($, _, Config, Package, NamedItems) {
	return NamedItems.extend({

		//
		// Backbone attributes
		//

		model: Package,
		url: Config.servers.web + '/packages/public',

		//
		// filtering methods
		//

		getPublic: function() {
			return this.getByAttribute('package_sharing_status', 'public');
		},

		getPrivate: function() {
			return this.getByAttribute('package_sharing_status', 'private');
		},

		getProtected: function() {
			return this.getByAttribute('package_sharing_status', 'protected');
		},

		getNonPublic: function() {
			return this.getByNotAttribute('package_sharing_status', 'public');
		},

		getPlatformUserSelectable: function() {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(item) {
				if (item.isPlatformUserSelectable()) {
					collection.add(item);
				}
			});

			return collection;
		},

		getPlatformNotUserSelectable: function() {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(item) {
				if (!item.isPlatformUserSelectable()) {
					collection.add(item);
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
				url: Config.servers.web + '/packages/users/' + user.get('user_uid')
			}));
		},

		fetchAll: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/packages/all'
			}));
		},

		fetchPublic: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/packages/public'
			}));
		},

		fetchProtected: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/packages/protected/' + project.get('project_uid')
			}));
		},

		fetchAllProtected: function(projects, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/packages/protected/' + projects.getUuidsStr()
			}));
		},

		fetchAvailableToMe: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/packages/available'
			}));
		},

		fetchByProject: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/packages/projects/' + project.get('project_uid')
			}));
		}
	}, {

		//
		// static methods
		//

		fetchNumByUser: function(user, options) {
			return $.ajax(Config.servers.web + '/packages/users/' + user.get('user_uid') + '/num', options);
		},

		fetchNumProtected: function(project, options) {
			return $.ajax(Config.servers.web + '/packages/protected/' + project.get('project_uid') + '/num', options);
		},

		fetchNumAllProtected: function(projects, options) {
			return $.ajax(Config.servers.web + '/packages/protected/' + projects.getUuidsStr() + '/num', options);
		}
	});
});
