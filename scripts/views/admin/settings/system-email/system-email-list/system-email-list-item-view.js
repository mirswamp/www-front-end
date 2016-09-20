/******************************************************************************\
|                                                                              |
|                            system-email-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing system email users.                   |
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
	'text!templates/admin/settings/system-email/system-email-list/system-email-list-item.tpl',
	'config',
	'registry',
	'models/users/user',
	'views/dialogs/error-view',
	'views/dialogs/confirm-view',
], function($, _, Backbone, Marionette, Template, Config, Registry, User, ErrorView, ConfirmView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				User: User,
				model: this.model,
				url: Registry.application.getURL() + '#accounts'
			}));
		}
	});
});
