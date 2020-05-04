/******************************************************************************\
|                                                                              |
|                           new-admin-invitations-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of new admininstator            |
|        invitations.                                                          |
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
	'jquery.validate',
	'text!templates/admin/settings/system-admins/invitations/new-admin-invitations-list/new-admin-invitations-list.tpl',
	'views/collections/tables/table-list-view',
	'views/admin/settings/system-admins/invitations/new-admin-invitations-list/new-admin-invitations-list-item-view'
], function($, _, Validate, Template, TableListView, NewAdminInvitationsListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		childView: NewAdminInvitationsListItemView,

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showDelete: this.options.showDelete
			};
		},

		childViewOptions: function() {
			return {
				showDelete: this.options.showDelete
			};
		}
	});
});
