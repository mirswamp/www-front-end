/******************************************************************************\
|                                                                              |
|                            project-revoked-event-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a specific type of project event.      |
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
	'text!templates/events/project-events/project-revoked-event.tpl',
	'views/events/project-events/project-event-view',
], function($, _, Template, ProjectEventView) {
	return ProjectEventView.extend({

		//
		// attributes
		//

		template: _.template(Template)
	});
});