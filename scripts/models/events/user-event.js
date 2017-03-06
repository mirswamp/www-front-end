/******************************************************************************\
|                                                                              |
|                                  user-event.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a generic event for a particular user.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
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

		user: undefined
	});
});