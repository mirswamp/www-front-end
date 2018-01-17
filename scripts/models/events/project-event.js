/******************************************************************************\
|                                                                              |
|                                 project-event.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract class of generalized project event.          |
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
	'models/events/event'
], function($, _, Event) {
	return Event.extend({

		//
		// attributes
		//

		event_type: undefined,
		project_uid: undefined,
		project_full_name: undefined,
		project_short_name: undefined
	});
});