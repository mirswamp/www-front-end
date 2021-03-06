/******************************************************************************\
|                                                                              |
|                                   user-events.js                             |
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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/users/user',
	'models/events/user-event',
	'collections/events/events'
], function($, _, Config, User, UserEvent, Events) {
	return Events.extend({

		//
		// Backbone attributes
		//

		model: UserEvent,
		url: Config.servers.web + '/events/users'
	}, {

		//
		// static methods
		//

		fetchNumAll: function(options) {
			return this.fetchNumAllByUser(application.session.user, options);
		},

		fetchNumAllByUser: function(user, options) {
			return $.ajax(Config.servers.web + '/events/users/' + user.get('user_uid') + '/num', options);
		}
	});
});