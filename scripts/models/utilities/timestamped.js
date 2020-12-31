/******************************************************************************\
|                                                                              |
|                                  timestamped.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a base time stamped base model.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
|                                                                              |
|******************************************************************************|
|                           Do It Early. Do It Often.                          |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'models/base-model',
	'utilities/time/iso8601'
], function($, _, BaseModel, Iso8601) {
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

			// convert dates
			//
			if (response.create_date) {
				response.create_date = this.toDate(response.create_date);
			}
			if (response.update_date) {
				response.update_date = this.toDate(response.update_date);
			}
			if (response.delete_date) {
				response.delete_date = this.toDate(response.delete_date);
			}

			return response;
		}
	});
});
