/******************************************************************************\
|                                                                              |
|                              email-verification-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the email verification view used in the new              |
|        user registration process.                                            |
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
	'text!templates/users/registration/email-verification.tpl',
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

			// go to welcome view
			//
			Backbone.history.navigate('#', {
				trigger: true
			});
		}
	});
});