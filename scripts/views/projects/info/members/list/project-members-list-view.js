/******************************************************************************\
|                                                                              |
|                           project-members-list-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a list of project members.          |
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
	'text!templates/projects/info/members/list/project-members-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/projects/info/members/list/project-members-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, ProjectMembersListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ProjectMembersListItemView,

		sorting: {

			// disable sorting on admin and delete columns
			//
			headers: { 
				5: { 
					sorter: false 
				},
				6: { 
					sorter: false 
				}
			},

			// sort on date column in descending order 
			//
			sortList: [[4, 1]] 
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showEmail: this.options.showEmail,
				showUsername: this.options.showUsername,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering,
				readOnly: this.options.readOnly
			}));
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				model: model,
				collection: this.collection,
				project: this.options.model,
				projectMembership: this.options.projectMemberships.at(index),
				projectMemberships: this.options.projectMemberships,
				showEmail: this.options.showEmail,
				showUsername: this.options.showUsername,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering,
				readOnly: this.options.readOnly
			}   
		}
	});
});
