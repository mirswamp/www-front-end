/******************************************************************************\
|                                                                              |
|                             select-permissions-list-view.js                         |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/info/permissions/select-permissions-list/select-permissions-list.tpl',
	'registry',
	'collections/permissions/user-permissions',
	'views/widgets/lists/sortable-table-list-view',
	'views/users/info/permissions/select-permissions-list/select-permissions-list-item-view'
], function($, _, Backbone, Marionette, Template, Registry, UserPermissions, SortableTableListView, SelectPermissionsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: SelectPermissionsListItemView,

		sorting: {

			// disable sorting on delete column
			//
			headers: { 
				4: { 
					sorter: false 
				},
				5: { 
					sorter: false 
				}
			},

			// sort on name in ascending order 
			//
			sortList: [[0, 0]] 
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				admin: Registry.application.session.user.get('admin_flag') == '1',
				collection: this.collection
			}));
		},

		childViewOptions: function() { 
			return { 
				parent: this.options.parent
			};
		}
	});
});
