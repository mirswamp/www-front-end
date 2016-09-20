/******************************************************************************\
|                                                                              |
|                                password-reset.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of password reset event.                         |
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

		idAttribute: 'password_reset_key',
		urlRoot: Config.servers.rws + '/password_resets',

		//
		// overridden Backbone methods
		//

		save: function(options) {
			$.ajax(_.extend(options, {
				url: this.url(),
				type: 'POST'
			}));
		},

		url: function() {
			return this.urlRoot + ( this.isNew()? '' : '/' + this.get('password_reset_key') + '/' + this.get('password_reset_id') );
		}
	});
});
