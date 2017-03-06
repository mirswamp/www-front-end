/******************************************************************************\
|                                                                              |
|                              account-created-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that is displayed to notify the user that         |
|        their account has been successfully created and is ready to use.      |
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
	'text!templates/users/registration/account-created.tpl'
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