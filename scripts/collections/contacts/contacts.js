/******************************************************************************\
|                                                                              |
|                                    contacts.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of contact / feedback items.           |
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
	'backbone',
	'config',
	'registry',
	'models/contacts/contact'
], function($, _, Backbone, Config, Registry, Contact) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: Contact,

		//
		// ajax methods
		//

		fetchAll: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/admins/' + Registry.application.session.user.get('user_uid') + '/contacts'
			}));
		}
	});
});