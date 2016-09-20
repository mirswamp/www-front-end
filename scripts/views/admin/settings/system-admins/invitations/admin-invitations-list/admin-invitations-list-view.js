/******************************************************************************\
|                                                                              |
|                               admin-invitations-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows administrator invitations.             |
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
	'text!templates/admin/settings/system-admins/invitations/admin-invitations-list/admin-invitations-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/admin/settings/system-admins/invitations/admin-invitations-list/admin-invitations-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, AdminInvitationsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: AdminInvitationsListItemView,

		sorting: {

			// disable sorting on remove column
			//
			headers: {
				4: { 
					sorter: false 
				}
			},

			// sort on date column in descending order 
			//
			sortList: [[2, 1]]
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function() {
			return {
				showDelete: this.options.showDelete
			}
		}
	});
});
