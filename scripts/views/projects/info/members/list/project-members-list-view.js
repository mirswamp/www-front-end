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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/info/members/list/project-members-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/projects/info/members/list/project-members-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, ProjectMembersListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ProjectMembersListItemView,

		emptyView: BaseView.extend({
			template: _.template("No project members.")
		}),

		// sort by join date column in descending order 
		//
		sortBy: ['join-date', 'descending'],

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showEmail: this.options.showEmail,
				showUsername: this.options.showUsername,
				showDelete: this.options.showDelete,
				readOnly: this.options.readOnly
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
			var index = this.collection.indexOf(model);
			return {
				index: index,
				model: model,
				collection: this.collection,
				project: this.options.model,
				showEmail: this.options.showEmail,
				showUsername: this.options.showUsername,
				showDelete: this.options.showDelete,
				readOnly: this.options.readOnly
			};
		}
	});
});
