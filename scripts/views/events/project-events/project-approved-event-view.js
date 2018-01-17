/******************************************************************************\
|                                                                              |
|                            project-approved-event-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a project event.                       |
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
	'text!templates/events/project-events/project-approved-event.tpl',
	'registry',
	'views/events/list/events-list-item-view',
], function($, _, Backbone, Marionette, Template, Registry, EventsListItemView) {
	return EventsListItemView.extend({

		//
		// methods
		//

		getInfo: function(data) {
			return _.template(Template, _.extend(data, {
				url: Registry.application.getURL() + '#projects/' + this.model.get('project_uid')
			}));
		}
	});
});