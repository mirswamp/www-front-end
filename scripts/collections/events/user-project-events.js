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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'registry',
	'utilities/iso8601',
	'models/users/user',
	'models/events/user-project-event',
	'collections/events/events'
], function($, _, Backbone, Config, Registry, Iso8601, User, UserProjectEvent, Events) {
	return Events.extend({

		//
		// Backbone attributes
		//

		model: UserProjectEvent,
		url: Config.servers.rws + '/events/projects/users',

		//
		// ajax methods
		//

		fetch: function(options) {
			return this.fetchByUser(Registry.application.session.user, options);
		},	

		fetchByUser: function(user, options) {
			return Events.prototype.fetch.call(this, _.extend(options || {}, {
				url: this.url + '/' + user.get('user_uid') + '/events'
			}));
		},	

		//
		// overridden Backbone methods
		//

		parse: function(data) {
			var events = [];
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				events.push(new UserProjectEvent({
					'date': Date.parseIso8601(item.event_date),
					'event_type': data[i].event_type,
					'user': new User(item.user),
					'project_uid': item.project_uid
				}));
			}
			return events;
		}
	}, {

		//
		// static methods
		//

		fetchNumByUser: function(project, user, options) {
			return $.ajax(this.url + '/' + user.get('user_uid') + '/events/num', {
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