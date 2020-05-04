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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/admin/admin-invitation',
	'collections/base-collection'
], function($, _, Config, AdminInvitation, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: AdminInvitation,
		url: Config.servers.web + '/admin_invitations',

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
			var successes = 0, errors = 0;

			// duplicate list so we can remove them while iterating the original
			//
			var invitations = _.clone(this);

			function sendItem(item) {
				item.send({

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

			// save admin invitations individually
			//
			for (var i = 0; i < this.length; i++) {
				sendItem(invitations.at(i));
			}
		}
	}, {
		//
		// static methods
		//

		fetchNumPendingByUser: function(user, options) {
			return $.ajax(Config.servers.web + '/admin_invitations/users/' + user.get('user_uid') + '/num', options);
		},
	});
});