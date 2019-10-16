/******************************************************************************\
|                                                                              |
|                               user-personal-events.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user events related to users.       |
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
	'utilities/time/iso8601',
	'models/users/user',
	'models/events/user-personal-event',
	'collections/events/events'
], function($, _, Config, Iso8601, User, UserPersonalEvent, Events) {
	return Events.extend({

		//
		// Backbone attributes
		//

		model: UserPersonalEvent,
		url: Config.servers.web + '/events/personal/users',

		//
		// ajax methods
		//

		fetch: function(options) {
			return this.fetchByUser(application.session.user, options);
		},

		fetchByUser: function(user, options) {
			return Events.prototype.fetch.call(this, _.extend(options || {}, {
				url: this.url + '/' + user.get('user_uid')
			}));
		},	

		//
		// overridden Backbone methods
		//

		parse: function(data) {
			var events = [];
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				events.push(new UserPersonalEvent({
					'date': Date.parseIso8601(item.event_date),
					'event_type': data[i].event_type,
					'user': new User(item.user)
				}));
			}
			return events;
		}
	});
});