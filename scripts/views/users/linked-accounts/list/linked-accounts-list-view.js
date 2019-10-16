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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/linked-accounts/list/linked-accounts-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/users/linked-accounts/list/linked-accounts-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, LinkedAccountsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: LinkedAccountsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No linked accounts.")
		}),

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

		templateContext: function() {
			return {
				admin: application.session.user.get('admin_flag'),
				collection: this.collection,
				showStatus: this.options.showStatus,
				showDelete: this.options.showDelete
			};
		},

		childViewOptions: function() {
			return {
				parent: this.options.parent,
				showStatus: this.options.showStatus,
				showDelete: this.options.showDelete
			};
		}
	});
});
