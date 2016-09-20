/******************************************************************************\
|                                                                              |
|                            permissions-list-item-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single permission item.             |
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
	'text!templates/users/info/permissions/select-permissions-list/select-permissions-list-item.tpl',
	'registry',
	'config',
	'models/permissions/user-permission'
], function($, _, Backbone, Marionette, Template, Registry, Config, UserPermission) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click button.request': 'onClickRequest',
			'change select.status': 'onChangeStatus'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, { 
				admin: Registry.application.session.user.get('admin_flag') == '1',
				permission: data 
			});
		},

		//
		// event handling methods
		//

		onClickRequest: function(event) {
			this.options.parent.requestPermission(this.model, event);
		},

		onChangeStatus: function(event) {
			this.model.set('status', event.target.value);
			this.options.parent.setPermission(this.model);
		}
	});
});
