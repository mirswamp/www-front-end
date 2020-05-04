/******************************************************************************\
|                                                                              |
|                                   contact.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an instance of contact / feedback.            |
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
	'config',
	'models/utilities/timestamped',
	'models/utilities/phone-number'
], function($, _, Config, Timestamped, PhoneNumber) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'contact_uuid',
		urlRoot: Config.servers.web + '/contacts',

		//
		// methods
		//

		setUser: function(user) {
			this.set({
				'first_name': user.get('first_name'),
				'last_name': user.get('last_name'),
				'email': user.get('email')
			});
		},

		hasName: function() {
			return this.has('first_name') || this.has('last_name');
		},

		hasFullName: function() {
			return this.has('first_name') && this.has('last_name');
		},
		
		getFullName: function() {
			return this.hasName()? this.get('first_name') + ' ' + this.get('last_name') : '';
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