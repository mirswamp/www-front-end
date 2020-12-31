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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/accounts/linked-accounts/list/linked-accounts-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/users/accounts/linked-accounts/list/linked-accounts-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, LinkedAccountsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: LinkedAccountsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No sign in providers.")
		}),

		// sort by provider column in descending order 
		//
		sortBy: ['provider', 'ascending'],

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
