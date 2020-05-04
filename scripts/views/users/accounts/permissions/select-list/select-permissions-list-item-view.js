/******************************************************************************\
|                                                                              |
|                       select-permissions-list-item-view.js                   |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/accounts/permissions/select-list/select-permissions-list-item.tpl',
	'models/permissions/user-permission',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, UserPermission, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click button.request': 'onClickRequest',
			'click button.renew': 'onClickRenew',
			'change select.status': 'onChangeStatus'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return { 
				admin: application.session.user.isAdmin(),
				status: this.model.get('status'),
				expiration_date: this.model.get('expiration_date')
			};
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
