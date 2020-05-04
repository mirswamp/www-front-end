/******************************************************************************\
|                                                                              |
|                       select-permissions-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a user's current list of.           |
|        permissions.                                                          |
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
	'text!templates/users/accounts/permissions/select-list/select-permissions-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/users/accounts/permissions/select-list/select-permissions-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, SelectPermissionsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: SelectPermissionsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No permissions.")
		}),

		// sort by title column in ascending order 
		//
		sortBy: ['title', 'ascending'],
		appended: SortableTableListView.prototype.prepended.concat(['request']),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				admin: application.session.user.get('admin_flag'),
				collection: this.collection
			};
		},

		childViewOptions: function() { 
			return { 
				parent: this.options.parent
			};
		}
	});
});
