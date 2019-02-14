/******************************************************************************\
|                                                                              |
|                     linked-account-error-prompt-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the error prompt view used in the linked account         |
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
	'text!templates/users/prompts/linked-account-error-prompt.tpl',
	'registry',
	'config'
], function($, _, Backbone, Marionette, Template, Registry, Config) {
	return Backbone.Marionette.ItemView.extend({

		template: function(){
			return _.template(Template, {
				type: this.options.type
			});
		}

	});
});
