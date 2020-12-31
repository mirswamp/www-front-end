/******************************************************************************\
|                                                                              |
|                                user-project-events.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user events related to projects.    |
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
	'utilities/time/iso8601',
	'models/users/user',
	'models/events/user-project-event',
	'collections/events/events'
], function($, _, Config, Iso8601, User, UserProjectEvent, Events) {
	return Events.extend({

		//
		// Backbone attributes
		//

		model: UserProjectEvent,
		url: Config.servers.web + '/events/projects/users',

		//
		// ajax methods
		//

		fetch: function(options) {
			return this.fetchByUser(application.session.user, options);
		},	

		fetchByUser: function(user, options) {
			return Events.prototype.fetch.call(this, _.extend(options || {}, {
				url: this.url + '/' + user.get('user_uid') + '/events'
			}));
		}
	}, {

		//
		// static methods
		//

		fetchNumByUser: function(project, user, options) {
			return $.ajax(this.prototype.url + '/' + user.get('user_uid') + '/events', {
				success: function(data) {

					// count events belonging to specific project
					//
					var count = 0;
					var projectUid = project.get('project_uid');
					for (var i = 0; i < data.length; i++) {
						if (data[i].project_uid == projectUid) {
							count++;
						}
					}
					options.success(count);
				}
			});
		}
	});
});