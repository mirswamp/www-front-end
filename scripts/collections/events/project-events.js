/******************************************************************************\
|                                                                              |
|                                 project-events.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user events.                        |
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
	'backbone',
	'config',
	'registry',
	'utilities/time/iso8601',
	'models/events/project-event',
	'collections/events/events'
], function($, _, Backbone, Config, Registry, Iso8601, ProjectEvent, Events) {
	return Events.extend({

		//
		// Backbone attributes
		//

		model: ProjectEvent,
		url: Config.servers.web + '/events/projects',

		//
		// ajax methods
		//

		fetch: function(options) {
			return this.fetchByUser(Registry.application.session.user, options);
		},

		fetchByUser: function(user, options) {
			return Events.prototype.fetch.call(this, _.extend(options || {}, {
				url: this.url + '/users/' + user.get('user_uid')
			}));
		},

		//
		// overridden Backbone methods
		//

		parse: function(data) {
			var events = [];
			for (var i = 0; i < data.length; i++) {
				var item = data[i];

				// parse event date
				//
				if (item.event_date) {
					if (item.event_date === '0000-00-00 00:00:00') {
						item.event_date = new Date(0);
					} else {
						item.event_date = Date.parseIso8601(item.event_date);
					}
				}

				// create new project event
				//
				events.push(new ProjectEvent({
					'event_type': data[i].event_type,
					'date': item.event_date,
					'project_uid': item.project_uid,
					'project_name': item.full_name
				}));
			}
			return events;
		}
	}, {

		//
		// static methods
		//

		fetchNumByUser: function(project, user, options) {
			return $.ajax(Config.servers.web + '/events/projects/users/' + user.get('user_uid') + '/num', {
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