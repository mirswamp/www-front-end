/******************************************************************************\
|                                                                              |
|                                 project-event.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract class of generalized project event.          |
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
	'models/events/event'
], function($, _, Event) {
	return Event.extend({

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

			// convert attributes
			//
			if (response.event_date) {
				response.event_date = this.toDate(response.event_date);
			}

			return response;
		}
	});
});