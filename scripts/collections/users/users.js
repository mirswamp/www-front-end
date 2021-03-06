/******************************************************************************\
|                                                                              |
|                                    users.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of users.                              |
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
	'models/users/user',
	'collections/base-collection'
], function($, _, Config, User, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: User,
		url: Config.servers.web + '/users',

		//
		// ajax methods
		//

		fetchAll: function(options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/admin/users/all' 
			}));
		},

		fetchEnabled: function(options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/admin/users/enabled'
			}));
		},

		fetchSignedIn: function(options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/admin/users/signed-in'
			}));
		},

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/projects/' + project.get('project_uid') + '/users'
			}));
		},

		fetchAdmins: function(admin, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/admin/admins/all'
			}));
		},

		fetchByInvitees: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/admin_invitations/invitees'
			}));
		},

		fetchByInviters: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/admin_invitations/inviters'
			}));
		},

		fetchEmail: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/admin/users/email' + (options && options.show_inactive? '?show_inactive=true' : '')
			}));
		},

		sendEmail: function(subject, body, options) {
			return $.ajax(_.extend(options, {
				type: 'POST',
				url: Config.servers.web + '/admin/users/email',
				data: {
					subject: subject,
					body: body,
					include: options? options.include : undefined,
					exclude: options? options.exclude : undefined
				}
			}));
		},

		//
		// bulk operation methods
		//

		setForcePasswordReset: function(forcePasswordReset) {
			this.each(function(model, index) {
				model.setForcePasswordReset(forcePasswordReset);
			});
		},

		setHibernating: function(hibernating) {
			this.each(function(model, index) {
				model.setHibernating(hibernating);
			});
		}
	});
});
