/******************************************************************************\
|                                                                              |
|                      linked-account-login-prompt-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the login prompt view used in the linked account         |
|        authentication process.                                               |
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
	'backbone',
	'marionette',
	'text!templates/users/prompts/linked-account-login-prompt.tpl',
	'models/users/session'
], function($, _, Backbone, Marionette, Template, Session) {
	return Backbone.Marionette.ItemView.extend({

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template);
		},

		onRender: function(){
			Session.linkedAccountLogin();
		}
	});
});
