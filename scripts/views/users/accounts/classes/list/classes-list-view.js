/******************************************************************************\
|                                                                              |
|                             classes-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a list of user classes.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/accounts/classes/list/classes-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/users/accounts/classes/list/classes-list-item-view'
], function($, _, Template, BaseView, SortableTableListView, ClassesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//
		childView: ClassesListItemView,
		template: _.template(Template),

		emptyView: BaseView.extend({
			template: _.template("No classes.")
		}),

		// sort by date column in descending order 
		//
		sortBy: ['date', 'descending'],

		//
		// constructor
		//

		initialize: function() {
			var self = this;
			this.listenTo(this.collection, 'change', function() {
				self.render();
				self.onShow();
			});
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
				user: this.model,
				showDelete: this.options.showDelete,
				parent: this
			};
		},

		getEmptyView: function() {
			return this.noChildrenView;
		}
	});
});
