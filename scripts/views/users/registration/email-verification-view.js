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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/registration/email-verification.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
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