/******************************************************************************\
|                                                                              |
|                        new-project-invitations-list-view.js                  |
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
	'text!templates/projects/info/members/invitations/new-project-invitations-list/new-project-invitations-list.tpl',
	'views/base-view',
	'views/collections/tables/table-list-view',
	'views/projects/info/members/invitations/new-project-invitations-list/new-project-invitations-list-item-view'
], function($, _, Template, BaseView, TableListView, NewProjectInvitationsListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: NewProjectInvitationsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No new project invitations.")
		}),

		events: {
			'blur input.email': 'onBlurEmail'
		},

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
		},

		update: function() {
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children.findByIndex(i);
				child.model.set(child.getValues());
			}
		}
	});
});
