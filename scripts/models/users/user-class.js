/******************************************************************************\
|                                                                              |
|                                user-class.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a class that a user is enrolled in.           |
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
	'models/utilities/timestamped'
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

		//
		// attributes
		//

		defaults: {
			'class_code': undefined,
			'description': undefined,
			'start_date': undefined,
			'end_date': undefined,
			'commercial_tool_access': false
		},

		//
		// Backbone attributes
		//

		idAttribute: 'class_code',
		urlRoot: Config.servers.web + '/users/classes',

		//
		// ajax methods
		//

		addMember: function(user, options) {
			return $.ajax(_.extend({
				method: 'POST',
				url: Config.servers.web + '/users/' + user.get('user_uid') + '/classes/' + this.get('class_code')
			}, options));
		},


		removeMember: function(user, options) {
			return $.ajax(_.extend({
				method: 'DELETE',
				url: Config.servers.web + '/users/' + user.get('user_uid') + '/classes/' + this.get('class_code')
			}, options));
		}
	});
});
