/******************************************************************************\
|                                                                              |
|                          project-invitations-list-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list a user project invitations.     |
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
	'text!templates/projects/info/members/invitations/project-invitations-list/project-invitations-list.tpl',
	'registry',
	'views/widgets/lists/sortable-table-list-view',
	'views/projects/info/members/invitations/project-invitations-list/project-invitations-list-item-view'
], function($, _, Backbone, Marionette, Template, Registry, SortableTableListView, ProjectInvitationsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ProjectInvitationsListItemView,

		sorting: {
			
			// disable sorting on delete column
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
				config: Registry.application.config,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function() {
			return {
				project: this.options.model,
				showDelete: this.options.showDelete
			}   
		}
	});
});
