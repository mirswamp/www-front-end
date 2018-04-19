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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/classes/list/classes-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/users/classes/list/classes-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, ClassesListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//
		childView: ClassesListItemView,

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

		noChildrenView: Marionette.ItemView.extend({
			template: _.template("No classes have been created for this account.")
		}),

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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showDelete: this.options.showDelete
			}));
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
