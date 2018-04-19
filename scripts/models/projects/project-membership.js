/******************************************************************************\
|                                                                              |
|                               project-membership.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an instance of a user membership in a project.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
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

		idAttribute: 'membership_uid',
		urlRoot: Config.servers.web + '/memberships',

		//
		// methods
		//

		isAdmin: function() {
			return this.get('admin_flag');
		},

		setAdmin: function(isAdmin) {
			this.set({
				'admin_flag': isAdmin
			});
		},

		belongsTo: function(user) {
			return this.get('user_uid') == user.get('user_uid');
		}
	});
});
