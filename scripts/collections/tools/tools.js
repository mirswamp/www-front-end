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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'registry',
	'models/tools/tool',
	'collections/utilities/named-items'
], function($, _, Backbone, Config, Registry, Tool, NamedItems) {
	var Class = NamedItems.extend({

		//
		// Backbone attributes
		//

		model: Tool,
		url: Config.servers.csa + '/tools',

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
			var collection = this.clone();

			collection.reset();
			this.each(function(item) {
				if (item.isOpen()) {
					collection.add(item);
				}
			});

			return collection;
		},

		getRestricted: function() {
			var collection = this.clone();

			collection.reset();
			this.each(function(item) {
				if (item.isRestricted()) {
					collection.add(item);
				}
			});

			return collection;
		},

		//
		// ajax methods
		//

		fetch: function(options) {
			return this.fetchByUser(Registry.application.session.user, options);
		},

		fetchByUser: function(user, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/tools/users/' + user.get('user_uid')
			}));
		},

		fetchAll: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/tools/all'
			}));
		},

		fetchPublic: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/tools/public'
			}));
		},

		fetchRestricted: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/tools/restricted'
			}));
		},

		fetchProtected: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/tools/protected/' + project.get('project_uid')
			}));
		},

		fetchByProject: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/tools/projects/' + project.get('project_uid')
			}));
		}
	}, {

		//
		// static methods
		//

		fetchNumByUser: function(user, options) {
			return $.ajax(Config.servers.csa + '/tools/users/' + user.get('user_uid') + '/num', options);
		},
	});

	return Class;
});
