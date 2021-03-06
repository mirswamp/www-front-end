/******************************************************************************\
|                                                                              |
|                                     contact.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an instance of contact / question.                       |
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
	'models/base-model',
	'models/utilities/phone-number'
], function($, _, Config, BaseModel, PhoneNumber) {
	return BaseModel.extend({

		//
		// attributes
		//

		defaults: {
			'first_name': undefined,
			'last_name': undefined,
			'email': undefined,
			'phone': undefined,
			'affiliation': undefined
		},

		//
		// Backbone attributes
		//

		idAttribute: 'contact_id',
		urlRoot: Config.servers.web + '/contacts',

		//
		// constructor
		//

		initialize: function() {
			if (this.isNew()) {
				this.set({
					'phone': new PhoneNumber()
				});
			}
		},

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			var JSON = Timestamped.prototype.parse.call(this, response);

			// parse subfields
			//
			JSON.phone = new PhoneNumber(
				PhoneNumber.prototype.parse(response.phone)
			);

			return JSON;
		},

		toJSON: function() {

			// call superclass method
			//
			var JSON = Timestamped.prototype.toJSON.call(this);

			// convert subfields
			//
			if (this.has('phone')) {
				JSON.phone = this.get('phone').toString();
			}

			return JSON;
		}
	});
});