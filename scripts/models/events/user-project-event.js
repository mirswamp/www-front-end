/******************************************************************************\
|                                                                              |
|                                user-project-event.js                         |
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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'models/events/user-event'
], function($, _, UserEvent) {
	return UserEvent.extend({

		//
		// attributes
		//

		event_type: undefined,
		project_uid: undefined,
		project_name: undefined,

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			var JSON = UserEvent.prototype.parse.call(this, response);

			// parse subfields
			//
			JSON.user = new User(
				response.user
			);

			return JSON;
		},
	});
});