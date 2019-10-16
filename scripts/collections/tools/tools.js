/******************************************************************************\
|                                                                              |
|                                     tools.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of software assessment tools.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/tools/tool',
	'collections/utilities/named-items'
], function($, _, Config, Tool, NamedItems) {
	return NamedItems.extend({

		//
		// Backbone attributes
		//

		model: Tool,
		url: Config.servers.web + '/tools',

		//
		// filtering methods
		//

		getPublic: function() {
			return this.getByAttribute('tool_sharing_status', 'public');
		},

		getPrivate: function() {
			return this.getByAttribute('tool_sharing_status', 'private');
		},

		getProtected: function() {
			return this.getByAttribute('tool_sharing_status', 'protected');
		},

		getNonPublic: function() {
			return this.getByNotAttribute('tool_sharing_status', 'public');
		},

		getOpen: function() {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(item) {
				if (item.isOpen()) {
					collection.add(item);
				}
			});

			return collection;
		},

		getRestricted: function() {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(item) {
				if (item.isRestricted()) {
					collection.add(item);
				}
			});

			return collection;
		},

		getByPackageType: function(packageType) {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(tool, index, list) {
				if (tool.supports(packageType)) {
					collection.push(tool);
				}
			});

			return collection;
		},

		getByPlatform: function(platform) {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(tool, index, list) {
				if (platform.supports(tool)) {
					collection.push(tool);
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
				url: Config.servers.web + '/tools/users/' + user.get('user_uid')
			}));
		},

		fetchAll: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/tools/all'
			}));
		},

		fetchPublic: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/tools/public'
			}));
		},

		fetchRestricted: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/tools/restricted'
			}));
		},

		fetchProtected: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/tools/protected/' + project.get('project_uid')
			}));
		},

		fetchByProject: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/tools/projects/' + project.get('project_uid')
			}));
		}
	}, {

		//
		// static methods
		//

		fetchNumByUser: function(user, options) {
			return $.ajax(Config.servers.web + '/tools/users/' + user.get('user_uid') + '/num', options);
		},
	});
});
