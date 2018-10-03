/******************************************************************************\
|                                                                              |
|                             user-project-event-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a user project event.                  |
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
	'backbone',
	'marionette',
	'models/users/user',
	'models/projects/project',
	'views/events/list/events-list-item-view',
], function($, _, Backbone, Marionette, User, Project, EventsListItemView) {
	return EventsListItemView.extend({

		//
		// methods
		//

		onRender: function() {
			this.showProject();
		},

		showProject: function() {
			var self = this;
			var project = new Project({
				project_uid: this.model.get('project_uid')
			});

			// fetch project
			//
			project.fetch({

				// callbacks
				//
				success: function() {
					self.$el.find('.project-name').html(project.get('full_name'));
				}
			});	
		}
	});
});