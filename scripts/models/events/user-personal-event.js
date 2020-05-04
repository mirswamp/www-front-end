/******************************************************************************\
|                                                                              |
|                               user-personal-event.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a project event for a particular user.                   |
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
	'models/events/user-event',
	'models/users/user'
], function($, _, UserEvent, User) {
	return UserEvent.extend({

		//
		// attributes
		//

		event_type: undefined,

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