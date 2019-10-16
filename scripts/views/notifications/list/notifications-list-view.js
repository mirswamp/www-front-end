/******************************************************************************\
|                                                                              |
|                            notifications-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of notifications.           |
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
	'text!templates/notifications/list/notifications-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/notifications/list/notifications-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, NotificationsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: NotificationsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No notifications.")
		}),

		sorting: {

			// sort on date column in ascending order 
			//
			sortList: [[1, 1]]
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showNumbering: this.options.showNumbering
			};
		},

		childViewOptions: function(model) {

			// check if empty view
			//
			if (!model) {
				return {};
			}

			// return view options
			//
			return {
				index: this.collection.indexOf(model),
				showNumbering: this.options.showNumbering,
				onClick: this.options.onClick
			};
		}
	});
});