/******************************************************************************\
|                                                                              |
|                                    projects.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of projects.                           |
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
	'backbone',
	'config',
	'registry',
	'models/projects/project',
	'collections/base-collection'
], function($, _, Backbone, Config, Registry, Project, BaseCollection) {
	var Class = BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Project,
		url: Config.servers.web + '/projects',

		//
		// querying methods
		//

		hasOwnedBy: function(user) {
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				if (model.isOwnedBy(user) && !model.isDeactivated()) {
					return true;
				}
			}
			return false;
		},

		hasNotOwnedBy: function(user) {
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				if (!model.isOwnedBy(user) && !model.isDeactivated()) {
					return true;
				}
			}
			return false;
		},

		getOwnedBy: function(user) {
			var collection = new Class();
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				if (model.isOwnedBy(user) && !model.isDeactivated()) {
					collection.add(model);
				}
			}
			return collection;
		},

		getNotOwnedBy: function(user) {
			var collection = new Class();
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				if (!model.isOwnedBy(user) && !model.isDeactivated()) {
					collection.add(model);
				}
			}
			return collection;
		},

		getTrialProjects: function() {
			var collection = new Class();
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				if (model.isTrialProject()) {
					collection.add(model);
				}
			}
			return collection;			
		},

		getNonTrialProjects: function() {
			var collection = new Class();
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				if (!model.isTrialProject()) {
					collection.add(model);
				}
			}
			return collection;			
		},

		//
		// uuid handling methods
		//
		
		getUuids: function() {
			var Uuids = [];
			for (var i = 0; i < this.length; i++) {
				Uuids.push(this.at(i).get('project_uid'));
			}
			return Uuids;
		},

		getUuidsStr: function() {
			return this.uuidsArrayToStr(this.getUuids());
		},

		uuidsArrayToStr: function(uuids) {
			var str = '';
			for (var i = 0; i < uuids.length; i++) {
				if (i > 0) {
					str += '+';
				}
				str += uuids[i];
			}
			return str;		
		},

		uuidsStrToArray: function(str) {
			return str.split('+');
		},

		//
		// ajax methods
		//

		fetch: function(options) {
			return this.fetchByUser(Registry.application.session.user, options || {});
		},

		fetchByUser: function(user, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: user.url() + '/projects'
			}));
		},

		fetchByPackage: function(package, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: package.url() + '/projects',
			}));	
		},

		fetchByPackageVersion: function(packageVersion, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: packageVersion.url() + '/projects',
			}));	
		},

		fetchAll: function(options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/admins/' + Registry.application.session.user.get('user_uid') + '/projects'
			}));
		}
	}, {

		//
		// static methods
		//

		fetchNum: function(options) {
			Class.fetchNumByUser(Registry.application.session.user, options);
		},

		fetchNumByUser: function(user, options) {
			return $.ajax(Config.servers.web + '/users/' + user.get('user_uid') + '/projects/num', options);
		}
	});

	return Class;
});
