/******************************************************************************\
|                                                                              |
|                               user-classes.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of classes that a user may be          |
|        enrolled in.                                                          |
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
	'models/users/user-class',
	'collections/base-collection'
], function($, _, Config, UserClass, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: UserClass,
		url: Config.servers.web + '/users/classes',

		//
		// ajax methods
		//

		fetchByUser: function(user, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/users/' + user.get('user_uid') + '/classes'
			}));
		}
	});
});
