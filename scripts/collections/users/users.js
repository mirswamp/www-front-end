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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'registry',
	'models/users/user',
	'collections/base-collection'
], function($, _, Backbone, Config, Registry, User, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: User,
		url: Config.servers.web + '/users',

		//
		// filtering methods
		//

		getEnabled: function() {
			var collection = this.clone();

			collection.reset();
			this.each(function(item) {
				if (item.isEnabled()) {
					collection.add(item);
				}
			});

			return collection;
		},

		getDisabled: function() {
			var collection = this.clone();

			collection.reset();
			this.each(function(item) {
				if (item.isDisabled()) {
					collection.add(item);
				}
			});

			return collection;
		},

		//
		// ajax methods
		//

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/projects/' + project.get('project_uid') + '/users'
			}));
		},

		fetchAdmins: function(admin, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/admins/' + admin.get('user_uid') + '/admins'
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

		fetchAll: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/admins/' + Registry.application.session.user.get('user_uid') + '/users'
			}));
		},

		sendEmail: function( subject, body, options ){
			var recipients = this.map(function( model ){
				return model.get('email');
			});
			$.ajax(_.extend(options, {
				type: 'POST',
				url: Config.servers.web + '/admins_email',
				data: {
					subject: subject,
					body: body,
					recipients: recipients
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
