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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'views/users/accounts/events/list/events-list-item-view',
], function($, _, EventsListItemView) {
	return EventsListItemView.extend({

		//
		// methods
		//

		templateContext: function() {
			return {
				url: application.getURL() + '#projects/' + this.model.get('project_uid'),
			};
		}
	});
});