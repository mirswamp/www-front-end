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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/contacts/contact',
	'collections/base-collection'
], function($, _, Config, Contact, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Contact,

		//
		// ajax methods
		//

		fetchAll: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/admins/' + application.session.user.get('user_uid') + '/contacts'
			}));
		}
	});
});