/******************************************************************************\
|                                                                              |
|                        github-login-prompt-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the acceptable use policy view used in the new           |
|        GitHub link process.                                                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/prompts/github-login-prompt.tpl',
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
			Session.githubLogin();
		}
	});
});
