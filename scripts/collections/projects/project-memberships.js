/******************************************************************************\
|                                                                              |
|                               project-memberships.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of project memberships.                |
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
	'models/projects/project-membership',
	'collections/base-collection'
], function($, _, Config, ProjectMembership, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: ProjectMembership,

		//
		// methods
		//

		numAdmins: function() {
			var count = 0;
			for (var i = 0; i < this.length; i++){
				if (this.at(i).isAdmin()){
					count++;
				}
			}
			return count;
		},

		//
		// ajax methods
		//

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/projects/' + project.get('project_uid') + '/memberships'
			}));
		},

		fetchByUser: function(user, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/users/' + user.get('user_uid') + '/memberships'
			}));
		}
	});
});
