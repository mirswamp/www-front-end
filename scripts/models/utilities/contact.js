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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'models/utilities/timestamped',
	'models/utilities/phone-number'
], function($, _, Backbone, Config, Timestamped, PhoneNumber) {
	return Backbone.Model.extend({

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
		// overridden Backbone methods
		//

		initialize: function() {
			if (this.isNew()) {
				this.set({
					'phone': new PhoneNumber()
				});
			}
		},

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