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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/authentication/user-linked-account',
	'collections/base-collection'
], function($, _, Config, UserLinkedAccount, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: UserLinkedAccount,

		//
		// ajax methods
		//

		fetchByUser: function(user, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/linked-accounts/users/' + user.get('user_uid')
			}));
		}
	});
});
