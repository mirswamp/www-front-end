/******************************************************************************\
|                                                                              |
|                                admin-invitation.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an instance of an invitation to become a                 |
|        system administrator.                                                 |
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
	'models/utilities/timestamped',
	'models/users/user',
], function($, _, Config, Timestamped, User) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'invitation_key',
		urlRoot: Config.servers.web + '/admin_invitations',

		//
		// methods
		//

		isPending: function() {
			return this.getStatus() === 'pending';
		},

		isAccepted: function() {
			return this.getStatus() === 'accepted';
		},

		isDeclined: function() {
			return this.getStatus() === 'declined';
		},

		getStatus: function() {
			if (this.has('status')) {
				return this.get('status').toLowerCase();
			} else if (this.has('accept_date')) {
				return 'accepted';
			} else if (this.has('decline_date') && (this.get('decline_date') !== null)) {
				return 'declined';
			} else {
				return 'pending';
			}
		},

		//
		// ajax methods
		//

		send: function(options) {
			var self = this;
			var response;

			if (this.has('email')) {

				// find user associated with this email
				//
				response = $.ajax({
					url: Config.servers.web + '/admin/email/user',
					type: 'POST',
						dataType: 'json',

						// callbacks
						//
						data: {
							'email': this.get('email')
						},

					// callbacks
					//
					success: function(data) {

						// create new invitation
						//
						self.save({
							'invitee_uid': data.user_uid
						}, options);
					},

					error: function(response) {

						// perform callback
						//
						if (options.error) {
							options.error(response);
						}
					}
				});
			} else if (this.has('username')) {

				// find user associated with this username
				//
				response = $.ajax({
					url: Config.servers.web + '/admin/username/user',
					type: 'POST',
						dataType: 'json',

						// callbacks
						//
						data: {
							'username': this.get('username')
						},

					// callbacks
					//
					success: function(data) {

						// create new invitation
						//
						self.save({
							'invitee_uid': data.user_uid
						}, options);
					},

					error: function(response) {

						// perform callback
						//
						if (options.error) {
							options.error(response);
						}
					}
				});
			}

			return response;
		},

		//
		// notification methods
		//

		getDescription: function() {
			var inviter = this.get('inviter');
			return "You have been invited by " + inviter.getFullName() + " to become an administrator.";
		},

		getNotificationHash: function() {
			return '#settings/admins/invite/confirm/' + this.get('invitation_key');
		},

		//
		// ajax methods
		//

		accept: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/admin_invitations/' + this.get('invitation_key') + '/accept',
				type: 'PUT'
			}));
		},

		decline: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/admin_invitations/' + this.get('invitation_key') + '/decline',
				type: 'PUT'
			}));
		},

		confirm: function(options) {
			var self = this;

			this.fetch({

				// callbacks
				//
				success: function(data) {

					// check invitation status
					//
					switch (self.getStatus()) {

						case 'accepted': 
							if (options.error) {
								options.error("This admin invitation has already been accepted.");
							}
							break;

						case 'declined':
							if (options.error) {
								options.error("This admin invitation has previously been declined.");
							}	
							break;

						default:
							self.confirmParticipants(options);
							break;
					}
				},

				error: function() {
					if (options.error) {
						options.error("This invitation appears to be invalid or expired. You should contact the project owner for a new invitation.");
					}
				}
			});
		},

		confirmParticipants: function(options) {
			var self = this;
			var inviter = new User(this.get('inviter'));
			var invitee = new User(this.get('invitee'));
			options.success(inviter, invitee);
		},

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			response = Timestamped.prototype.parse.call(this, response);

			// create user models
			//
			if (response.inviter) {
				response.inviter = new User(response.inviter);
			}
			if (response.invitee) {
				response.invitee = new User(response.invitee);
			}

			return response;
		}
	});
});
