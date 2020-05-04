/******************************************************************************\
|                                                                              |
|                                      event.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an instance of a generic event type.                     |
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
	'models/base-model'
], function($, _, BaseModel) {
	return BaseModel.extend({

		//
		// date conversion methods
		//

		toDate: function(date) {

			// handle string types
			//
			if (typeof(date) === 'string') {

				// handle null string
				//
				if (date === '0000-00-00 00:00:00') {
					date = new Date(0);

				// parse date string
				//
				} else {
					date = Date.parseIso8601(date);
				}
				
			// handle object types
			//
			} else if (typeof(date) === 'object') {
				if (date.date) {
					date = Date.parseIso8601(date.date);
				}
			}

			return date;
		},

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