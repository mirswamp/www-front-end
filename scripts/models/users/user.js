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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'registry',
	'models/utilities/timestamped',
	'models/utilities/phone-number',
	'models/utilities/address'
], function($, _, Config, Registry, Timestamped, PhoneNumber, Address) {
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
			'phone': undefined,
			'address': undefined,
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
			return this.get('email_verified_flag') == 1;
		},

		isPending: function() {
			return this.get('email_verified_flag') == 0;
		},

		isEnabled: function() {
			return this.get('enabled_flag') == 1;
		},

		isDisabled: function() {
			return this.get('enabled_flag') == 0;
		},

		isSameAs: function(user) {
			return user && this.get('user_uid') == user.get('user_uid');
		},

		isCurrentUser: function() {
			return this.isSameAs(Registry.application.session.user);
		},

		hasSshAccess: function() {
			return this.get('ssh_access_flag') == '1';
		},

		isPasswordResetRequired: function() {
			return this.get('forcepwreset_flag') == '1';
		},

		isHibernating: function() {
			return this.get('hibernate_flag') == '1';
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
						'enabled_flag': 0
					});
					break;
				case 'enabled':
					this.set({
						'enabled_flag': 1,
						'email_verified_flag': 1
					});
					break;
				case 'disabled':
					this.set({
						'enabled_flag': 0
					});
					break;
			}
		},

		setOwnerStatus: function(status) {
			switch (status) {
				case 'pending':
					this.set({
						'owner': 'pending'
					});
					break;
				case 'approved':
					this.set({
						'owner': 'approved'
					});
					break;
				case 'denied':
					this.set({
						'owner': 'denied'
					});
					break;
			}
		},

		setForcePasswordReset: function(forcePasswordReset) {
			this.set({
				'forcepwreset_flag': forcePasswordReset? 1 : 0
			});
		},

		setHibernating: function(hibernating) {
			this.set({
				'hibernate_flag': hibernating? 1 : 0
			});
		},

		//
		// admin methods
		//

		isAdmin: function() {
			return this.get('admin_flag') == 1;
		},

		isOwner: function() {
			return this.get('owner_flag') == 1;
		},

		setAdmin: function(isAdmin) {
			if (isAdmin) {
				this.set({
					'admin_flag': 1
				});
			} else {
				this.set({
					'admin_flag': 0
				});
			}
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

		resetPassword: function(password, options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/password_resets/' + options.password_reset_id + '/reset',
				type: 'PUT',
				data: {
					'password': password,
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

		/*
		initialize: function() {
			if (this.isNew()) {
				this.set({
					'address': new Address(),
					'phone': new PhoneNumber()
				});
			}
		},
		*/

		parse: function(response) {

			// call superclass method
			//
			var JSON = Timestamped.prototype.parse.call(this, response);

			// parse subfields
			//
			JSON.phone = new PhoneNumber(
				PhoneNumber.prototype.parse(response.phone)
			);
			JSON.address = new Address(
				Address.prototype.parse(response.address)
			);

			// convert dates
			//
			if (response.ultimate_login_date) {
				response.ultimate_login_date = this.toDate(response.ultimate_login_date);
			}
			if (response.penultimate_login_date) {
				response.penultimate_login_date = this.toDate(response.penultimate_login_date);
			}

			return JSON;
		},

		toJSON: function() {

			// call superclass method
			//
			var JSON = Timestamped.prototype.toJSON.call(this);

			// convert subfields
			//
			if (this.has('phone')) {
				JSON.phone = this.get('phone').toString();
			}
			if (this.has('address')) {
				JSON.address = this.get('address').toString();
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
