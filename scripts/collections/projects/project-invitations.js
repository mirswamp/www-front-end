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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'models/projects/project-invitation'
], function($, _, Backbone, Config, ProjectInvitation) {
	return Backbone.Collection.extend({

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

			// duplicate list so we can remove them while iterating the original
			//
			var invitations = _.clone(this);

			// save project invitations individually
			//
			var successes = 0, errors = 0;
			for (var i = 0; i < invitations.length; i++) {
				invitations.at(i).save(undefined, {

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