/******************************************************************************\
|                                                                              |
|                             user-last-login-event-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a user's personal event.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/accounts/events/user-personal-events/user-last-login-event.tpl',
	'views/users/accounts/events/user-personal-events/user-personal-event-view'
], function($, _, Template, UserPersonalEventView) {
	return UserPersonalEventView.extend({

		//
		// attributes
		//

		template: _.template(Template)
	});
});