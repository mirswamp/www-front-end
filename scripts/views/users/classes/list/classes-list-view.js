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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/classes/list/classes-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/users/classes/list/classes-list-item-view'
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

		sorting: {

			// disable sorting on delete column
			//
			headers: { 
				2: { 
					sorter: false 
				},
			},

			// sort on date in descending order 
			//
			sortList: [[1, 1]] 
		},

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

		onRender: function() {
			this.update();
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
		},

		update: function() {

			// ugly hack to hide / show table header 
			//
			if (this.collection.length == 0) {
				this.$el.find('thead').hide();
			} else {
				this.$el.find('thead').show();
			}

			// renumber (if list is numbered)
			//
			this.renumber();
		}
	});
});
