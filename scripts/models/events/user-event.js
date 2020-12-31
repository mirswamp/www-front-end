/******************************************************************************\
|                                                                              |
|                                  user-event.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a generic event for a particular user.                   |
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
	'models/events/event',
	'models/users/user'
], function($, _, Event, User) {
	return Event.extend({

		//
		// attributes
		//

		user: undefined,

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// convert attributes
			//
			if (response.user) {
				response.user = new User(response.user);
			}
			if (response.event_date) {
				response.event_date = this.toDate(response.event_date);
			}

			return response;
		}
	});
});