/******************************************************************************\
|                                                                              |
|                              email-verification.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of user account email verification.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/utilities/timestamped'
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'verification_key',
		urlRoot: Config.servers.web + '/verifications',

		//
		// ajax methods
		//

		verify: function(options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/verify/' + this.get('verification_key'),
				type: 'PUT'
			}));
		},

		resend: function(username, password, options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/verifications/resend',
				type: 'POST',
				data: {
					'username': username,
					'password': password
				}
			}));
		}
	});
});