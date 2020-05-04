/******************************************************************************\
|                                                                              |
|                            system-admins-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing the system administrators.            |
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
	'text!templates/admin/settings/system-admins/system-admins-list/system-admins-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/admin/settings/system-admins/system-admins-list/system-admins-list-item-view',
], function($, _, Template, BaseView, SortableTableListView, SystemAdminsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: SystemAdminsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No system administrators.")
		}),

		sortBy: ['user', 'ascending'],

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
