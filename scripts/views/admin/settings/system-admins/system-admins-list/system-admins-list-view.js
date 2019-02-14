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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/settings/system-admins/system-admins-list/system-admins-list.tpl',
	'registry',
	'views/widgets/lists/sortable-table-list-view',
	'views/admin/settings/system-admins/system-admins-list/system-admins-list-item-view',
], function($, _, Backbone, Marionette, Template, Registry, SortableTableListView, SystemAdminsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: SystemAdminsListItemView,

		sorting: {

			// disable sorting on remove column
			//
			headers: { 
				2: { 
					sorter: false 
				}
			},

			// sort on name column in ascending order 
			//
			sortList: [[0, 0]] 
		},

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

		childViewOptions: function() {
			return {
				showDelete: this.options.showDelete
			}
		}
	});
});
