/******************************************************************************\
|                                                                              |
|                                     user.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an application user.                          |
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
	'models/utilities/timestamped'
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

		//
		// attributes
		//

		defaults: {
			'first_name': undefined,
			'last_name': undefined,
			'preferred_name': undefined,
			'email': undefined,
			'username': undefined,
			'password': undefined,
			'affiliation': undefined
		},

		//
		// Backbone attributes
		//

		idAttribute: 'user_uid',
		urlRoot: Config.servers.web + '/users',

		//
		// querying methods
		//

		hasName: function() {
			return this.has('first_name') || this.has('last_name');
		},

		hasFullName: function() {
			return this.has('first_name') && this.has('last_name');
		},
	
		getFullName: function() {
			return this.hasName()? this.get('first_name') + ' ' + this.get('last_name') : '';
		},

		isOwnerOf: function(project) {
			return this.get('user_uid') ===  project.get('projectOwnerUid');
		},

		isVerified: function() {
			return this.get('email_verified_flag');
		},

		isPending: function() {
			return !this.get('email_verified_flag');
		},

		isEnabled: function() {
			return this.get('enabled_flag');
		},

		isDisabled: function() {
			return !this.isEnabled();
		},

		isSameAs: function(user) {
			return user && this.get('user_uid') == user.get('user_uid');
		},

		isCurrentUser: function() {
			return this.isSameAs(application.session.user);
		},

		isSignedIn: function() {
			return this.get('signed_in_flag');
		},

		hasSshAccess: function() {
			return this.get('ssh_access_flag');
		},

		isPasswordResetRequired: function() {
			return this.get('forcepwreset_flag');
		},

		isActive: function() {
			return !this.isHibernating();
		},

		isHibernating: function() {
			return this.get('hibernate_flag');
		},

		//
		// status methods
		//

		getStatus: function() {
			var status;
			if (this.isPending()) {
				status = 'pending';
			} else if (this.isEnabled()) {
				status = 'enabled';
			} else {
				status = 'disabled';
			}
			return status;
		},

		setStatus: function(status) {
			switch (status) {
				case 'pending':
					this.set({
						'enabled_flag': false
					});
					break;
				case 'enabled':
					this.set({
						'enabled_flag': true,
						'email_verified_flag': true
					});
					break;
				case 'disabled':
					this.set({
						'enabled_flag': false
					});
					break;
			}
		},

		setForcePasswordReset: function(forcePasswordReset) {
			this.set({
				'forcepwreset_flag': forcePasswordReset
			});
		},

		setHibernating: function(hibernating) {
			this.set({
				'hibernate_flag': hibernating
			});
		},

		//
		// admin methods
		//

		isAdmin: function() {
			return this.get('admin_flag');
		},

		isOwner: function() {
			return this.get('owner_flag');
		},

		setAdmin: function(isAdmin) {
			this.set({
				'admin_flag': isAdmin
			});
		},


		//
		// ajax methods
		//

		requestUsernameByEmail: function(email, options) {
			var self = this;
			$.ajax(
				_.extend({
					url: Config.servers.web + '/users/email/request-username',
					type: 'POST',
					dataType: 'JSON',
					data: {
						'email': email
					},

					// callbacks
					//
					success: function(data) {
						self.set(self.parse(data));
					}
				}, options)
			);
		},

		checkValidation: function(data, options) {
			return $.ajax(_.extend(options, {
				url: Config.servers.web + '/users/validate',
				type: 'POST',
				dataType: 'json',
				data: data
			}));
		},

		changePassword: function(oldPassword, newPassword, options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/users/' + this.get('user_uid') + '/change-password',
				type: 'PUT',
				data: {
					'old_password': oldPassword,
					'new_password': newPassword,
					'password_reset_key': options.password_reset_key,
					'password_reset_id': options.password_reset_id
				}
			}));
		},

		deleteAdminPriviledges: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/admins/' + this.get('user_uid'),
				type: 'DELETE'
			}));
		},

		requestPermission: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/users/' + this.get('user_uid') + '/permissions',
				type: 'POST'
			}));
		},

		setPermission: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/users/' + this.get('user_uid') + '/permissions',
				type: 'PUT'
			}));
		},

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			var JSON = Timestamped.prototype.parse.call(this, response);

			// convert dates
			//
			if (response.ultimate_login_date) {
				response.ultimate_login_date = this.toDate(response.ultimate_login_date);
			}
			if (response.penultimate_login_date) {
				response.penultimate_login_date = this.toDate(response.penultimate_login_date);
			}

			return JSON;
		}
	}, {
		
		//
		// static methods
		//

		requestLinkedAccountLink: function(username, password, githubId, confirmed, options) {
			$.ajax(_.extend(options, {
				type: 'POST',
				url: Config.servers.web + '/oauth2/link',
				data: {
					username: username,
					password: password,
					confirmed: confirmed,
					oauth2_id: githubId
				}
			}));
		},

		registerWithLinkedAccount: function(options) {
			$.ajax(_.extend(options, {
				type: 'GET',
				url: Config.servers.web + '/oauth2/register'
			}));
		},

		fetchFromLinkedAccount: function(options) {
			$.ajax(_.extend(options, {
				type: 'GET',
				url: Config.servers.web + '/oauth2/user'
			}));
		}
	});
});
