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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'registry',
	'models/packages/package',
	'collections/utilities/named-items'
], function($, _, Backbone, Config, Registry, Package, NamedItems) {
	return NamedItems.extend({

		//
		// Backbone attributes
		//

		model: Package,
		url: Config.servers.csa + '/packages/public',

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
			var collection = this.clone();

			collection.reset();
			this.each(function(item) {
				if (item.isPlatformUserSelectable()) {
					collection.add(item);
				}
			});

			return collection;
		},

		getPlatformNotUserSelectable: function() {
			var collection = this.clone();

			collection.reset();
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
			return this.fetchByUser(Registry.application.session.user, options);
		},

		fetchByUser: function(user, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/packages/users/' + user.get('user_uid')
			}));
		},

		fetchAll: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/packages/all'
			}));
		},

		fetchPublic: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/packages/public'
			}));
		},

		fetchProtected: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/packages/protected/' + project.get('project_uid')
			}));
		},

		fetchAllProtected: function(projects, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/packages/protected/' + projects.getUuidsStr()
			}));
		},

		fetchAvailableToMe: function(options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/packages/available'
			}));
		},

		fetchByProject: function(project, options) {
			return NamedItems.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.csa + '/packages/projects/' + project.get('project_uid')
			}));
		}
	}, {

		//
		// static methods
		//

		fetchTypes: function(options) {
			return $.ajax(Config.servers.csa + '/packages/types', options);
		},

		fetchNumByUser: function(user, options) {
			return $.ajax(Config.servers.csa + '/packages/users/' + user.get('user_uid') + '/num', options);
		},

		fetchNumProtected: function(project, options) {
			return $.ajax(Config.servers.csa + '/packages/protected/' + project.get('project_uid') + '/num', options);
		},

		fetchNumAllProtected: function(projects, options) {
			return $.ajax(Config.servers.csa + '/packages/protected/' + projects.getUuidsStr() + '/num', options);
		},

		packageTypesToLanguages: function(packageTypes) {
			var languages = [];

			// get language names
			//
			for (var i = 0; i < packageTypes.length; i++) {
				var packageType = packageTypes[i];
				if (packageType.package_type_enabled) {
					var name = packageType.name;
					if (name) {
						if (name.contains('C/C++') && !languages.contains('C/C++')) {
							languages.push('C/C++');
						} else if ((name.contains('Java') || name.contains('Android')) && !languages.contains('Java')) {
							languages.push('Java');
						} else if (name.contains('Python') && !languages.contains('Python')) {
							languages.push('Python');
						} else if (name.contains('Ruby') && !languages.contains('Ruby')) {
							languages.push('Ruby');
						}
					}
				}
			}

			return languages;
		},

		packageTypesToNames: function(packageTypes) {
			var names = [];

			// get package type names
			//
			for (var i = 0; i < packageTypes.length; i++) {
				names.push(packageTypes[i].name);
			}

			return names;
		}
	});
});
