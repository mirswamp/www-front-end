/******************************************************************************\
|                                                                              |
|                               admin-invitations.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of invitations to become a             |
|        system administrator.                                                 |
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
	'models/admin/admin-invitation'
], function($, _, Backbone, Config, AdminInvitation) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: AdminInvitation,
		url: Config.servers.rws + '/admin_invitations',

		//
		// ajax methods
		//

		save: function(options) {

			// allow bulk saving
			//
			this.sync('update', this, options);
		},

		fetchPendingByUser: function(user, options) {
			return this.fetch(_.extend(options, {
				url: this.url + '/users/' + user.get('user_uid')
			}));
		},
		
		//
		// bulk operation methods
		//

		send: function(options) {
			var self = this;

			// duplicate list so we can remove them while iterating the original
			//
			var invitations = _.clone(this);

			// save admin invitations individually
			//
			var successes = 0, errors = 0;
			for (var i = 0; i < this.length; i++) {

				// send invitation
				//
				invitations.at(i).send({

					// callbacks
					//
					success: function(model, response) {
						successes++;

						// remove model if sent
						//
						self.remove(model);

						// report success when completed
						//
						if (successes === invitations.length) {
							if (options.success) {
								options.success();
							}
						}
					},

					error: function(response) {
						errors++;

						// report first error
						//
						if (errors === 1) {
							if (options.error) {
								options.error(response);
							}
						}
					}
				});
			}
		}
	}, {
		//
		// static methods
		//

		fetchNumPendingByUser: function(user, options) {
			return $.ajax(Config.servers.rws + '/admin_invitations/users/' + user.get('user_uid') + '/num', options);
		},
	});
});