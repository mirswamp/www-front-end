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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'jquery.validate',
	'text!templates/admin/settings/system-admins/invitations/new-admin-invitations-list/new-admin-invitations-list.tpl',
	'registry',
	'views/widgets/lists/table-list-view',
	'views/admin/settings/system-admins/invitations/new-admin-invitations-list/new-admin-invitations-list-item-view'
], function($, _, Backbone, Marionette, Validate, Template, Registry, TableListView, NewAdminInvitationsListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: NewAdminInvitationsListItemView,

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				config: Registry.application.config,
				showDelete: this.options.showDelete
			}));
		},

		onRender: function() {
			this.validator = this.validate();
		},

		childViewOptions: function() {
			return {
				showDelete: this.options.showDelete
			}
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate();
		},

		isValid: function() {
			return this.validator.form();
		}
	});
});
