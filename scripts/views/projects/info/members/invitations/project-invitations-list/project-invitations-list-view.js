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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/info/members/invitations/project-invitations-list/project-invitations-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/projects/info/members/invitations/project-invitations-list/project-invitations-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, ProjectInvitationsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ProjectInvitationsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No project invitations.")
		}),

		// sort by date column in descending order
		//
		sortBy: ['date', 'descending'],

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
				project: this.options.model,
				showDelete: this.options.showDelete
			};
		}
	});
});
