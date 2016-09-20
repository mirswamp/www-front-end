/******************************************************************************\
|                                                                              |
|                             leave-project-event-view.js                      |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'registry',
	'text!templates/events/user-project-events/leave-project-event.tpl',
	'views/events/user-project-events/user-project-event-view'
], function($, _, Backbone, Marionette, Registry, Template, UserProjectEventView) {
	return UserProjectEventView.extend({

		//
		// methods
		//

		getInfo: function(data) {
			return _.template(Template, _.extend(data, {
				projectUrl: Registry.application.getURL() + '#projects/' + this.model.get('project_uid')
			}));
		}
	});
});