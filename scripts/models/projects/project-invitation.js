/******************************************************************************\
|                                                                              |
|                               project-invitation.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an instance of an invitation to join a project.          |
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
	'models/users/user',
	'models/projects/project',
	'models/utilities/timestamped'
], function($, _, Backbone, Config, Registry, User, Project, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'invitation_key',
		urlRoot: Config.servers.rws + '/invitations',

		//
		// querying methods
		//

		isPending: function() {
			return !this.has('accept_date') && !this.has('decline_date');
		},

		isAccepted: function() {
			return this.has('accept_date');
		},

		isDeclined: function() {
			return this.has('decline_date');
		},

		getStatus: function() {
			if (this.isAccepted()) {
				return 'accepted';
			} else if (this.isDeclined()) {
				return 'declined';
			} else {
				return 'pending';
			}
		},

		//
		// notification methods
		//

		getDescription: function() {
			return "You have been invited by " + this.get('inviter_name') + " to join project " + this.get('project_name') + ".";
		},

		getNotificationHash: function() {
			return '#projects/' + this.get('project_uid') + '/members/invite/confirm/' + this.get('invitation_key');
		},

		//
		// ajax methods
		//

		accept: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.rws + '/invitations/' + this.get('invitation_key') + '/accept',
				type: 'PUT'
			}));
		},

		decline: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.rws + '/invitations/' + this.get('invitation_key') + '/decline',
				type: 'PUT'
			}));
		},

		confirm: function(options) {
			var self = this;

			this.fetch({

				// callbacks
				//
				success: function(data) {
					var status = data.getStatus();

					// check invitation status
					//
					switch (status) {

						case 'accepted':
							if (options.error) {
								options.error("This project invitation has already been accepted.");
							}
							break;

						case 'declined':
							if (options.error) {
								options.error("This project invitation has previously been declined.");
							}
							break;

						default:
							self.confirmInviter({

								// callbacks
								//
								success: function(sender) {
									self.confirmProject({
										success: function(project) {
											if (options.success) {
												options.success(sender, project);
											}
										},

										error: function(message) {
											if (options.error) {
												options.error(message);
											}
										}
									});
								},

								error: function(message) {
									if (options.error) {
										options.error(message);
									}
								}
							});
							break;
					}
				},

				error: function() {
					if (options.error) {
						options.error("This project invitation appears to be invalid or expired. You should contact the project owner for a new invitation.");
					}
				}
			});
		},

		confirmInviter: function(options) {

			// fetch user
			//
			var user = new User({});

			user.fetch({
				url: Config.servers.rws + '/invitations/' + this.get('invitation_key') + '/inviter',

				// callbacks
				//
				success: function() {
					if (options.success) {
						options.success(user);
					}
				},

				error: function() {
					if (options.error) {
						options.error("The inviter of this project invitation is not a valid user.");
					}
				}
			});
		},

		confirmInvitee: function(options) {

			// fetch user
			//
			var user = new User({});

			user.fetch({
				url: Config.servers.rws + '/invitations/' + this.get('invitation_key') + '/invitee',

				// callbacks
				//
				success: function() {
					if (options.success) {
						options.success(user);
					}
				},

				error: function() {
					if (options.error) {
						options.error("The invitee of this project invitation is not a valid user.");
					}
				}
			});
		},

		confirmProject: function(options) {

			// fetch project
			//
			var project = new Project({
				'project_uid': this.get('project_uid')
			});

			project.fetchProjectConfirmation({

				// callbacks
				//
				success: function() {
					if (options.success) {
						options.success(project);
					}
				},

				error: function() {
					if (options.error) {
						options.error("This invitation appears to be invalid because the project for this invitation is no longer available.");
					}
				}
			});
		}
	});
});
