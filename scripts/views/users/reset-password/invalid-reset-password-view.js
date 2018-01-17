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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/reset-password/invalid-reset-password.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.ItemView.extend({

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
			Backbone.history.navigate('#home', {
				trigger: true
			});
		}
	});
});