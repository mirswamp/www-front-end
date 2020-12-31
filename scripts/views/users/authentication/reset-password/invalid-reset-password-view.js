/******************************************************************************\
|                                                                              |
|                            invalid-reset-password-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for resetting the user's password.                |
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
	'text!templates/users/authentication/reset-password/invalid-reset-password.tpl',
	'views/base-view'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// go to home view
			//
			application.navigate('#home');
		}
	});
});