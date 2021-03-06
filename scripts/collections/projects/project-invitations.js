/******************************************************************************\
|                                                                              |
|                              project-invitations.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user project invitations.           |
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
	'models/projects/project-invitation',
	'collections/base-collection'
], function($, _, Config, ProjectInvitation, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: ProjectInvitation,
		url: Config.servers.web + '/invitations',

		//
		// ajax methods
		//

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: this.url + '/projects/' + project.get('project_uid')
			}));
		},

		fetchPendingByUser: function(user, options) {
			return this.fetch(_.extend(options, {
				url: this.url + '/users/' + user.get('user_uid')
			}));
		},

		// allow bulk saving
		//
		save: function(options) {
			return this.sync('update', this, options);
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
				item.save(undefined, {

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

					error: function(model, response) {
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

			// save project invitations individually
			//
			for (var i = 0; i < invitations.length; i++) {
				sendItem(invitations.at(i));
			}
		}
	}, {

		//
		// static methods
		//

		fetchNumPendingByUser: function(user, options) {
			return $.ajax(Config.servers.web + '/invitations/users/' + user.get('user_uid') + '/num', options);
		},
	});
});