/******************************************************************************\
|                                                                              |
|                              user-linked-accounts.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user permissions.                   |
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
	'models/authentication/user-linked-account'
], function($, _, Backbone, Config, UserLinkedAccount) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: UserLinkedAccount,

		//
		// ajax methods
		//

		fetchByUser: function(user, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/linked-accounts/user/' + user.get('user_uid')
			}));
		}
	});
});
