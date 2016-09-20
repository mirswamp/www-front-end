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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/notifications/list/notifications-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/notifications/list/notifications-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, NotificationsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: NotificationsListItemView,

		sorting: {

			// sort on date column in ascending order 
			//
			sortList: [[1, 1]]
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showNumbering: this.options.showNumbering
			}));
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				showNumbering: this.options.showNumbering
			}
		}
	});
});