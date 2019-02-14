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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/permissions/select-list/select-permissions-list-item.tpl',
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
			'click button.renew': 'onClickRenew',
			'change select.status': 'onChangeStatus'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, { 
				admin: Registry.application.session.user.isAdmin(),
				permission: data 
			});
		},

		//
		// event handling methods
		//

		onClickRequest: function(event) {
			this.options.parent.requestPermission(this.model, event);
		},

		onClickRenew: function(event) {
			this.options.parent.renewPermission(this.model, event);
		},

		onChangeStatus: function(event) {
			if (this.model.isNew() && event.target.value == 'granted') {
				this.options.parent.requestPermission(this.model, event);
			} else {
				this.model.set('status', event.target.value);
				this.options.parent.setPermission(this.model);
			}
		}
	});
});
