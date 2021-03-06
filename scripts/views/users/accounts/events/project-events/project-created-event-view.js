/******************************************************************************\
|                                                                              |
|                             project-created-event-view.js                    |
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
	'text!templates/users/accounts/events/project-events/project-created-event.tpl',
	'views/users/accounts/events/project-events/project-event-view',
], function($, _, Template, ProjectEventView) {
	return ProjectEventView.extend({

		//
		// attributes
		//

		template: _.template(Template)
	});
});