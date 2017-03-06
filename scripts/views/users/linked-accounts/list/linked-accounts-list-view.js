/******************************************************************************\
|                                                                              |
|                            linked-accounts-list-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a user's current list of.           |
|        linked-accounts.                                                      |
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
	'text!templates/users/linked-accounts/list/linked-accounts-list.tpl',
	'registry',
	'config',
	'collections/authentication/user-linked-accounts',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/widgets/lists/sortable-table-list-view',
	'views/users/linked-accounts/list/linked-accounts-list-item-view'
], function($, _, Backbone, Marionette, Template, Registry, Config, UserPermissions, NotifyView, ErrorView, SortableTableListView, LinkedAccountsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//
		childView: LinkedAccountsListItemView,

		sorting: {

			// disable sorting on delete column
			//
			headers: { 
				3: { 
					sorter: false 
				},
				4: { 
					sorter: false 
				}
			},

			// sort on name in ascending order 
			//
			sortList: [[1, 0]] 
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				admin: Registry.application.session.user.get('admin_flag') == '1',
				collection: this.collection,
				showStatus: this.options.showStatus,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(){
			return {
				parent: this.options.parent,
				showStatus: this.options.showStatus,
				showDelete: this.options.showDelete
			};
		}
	});
});
