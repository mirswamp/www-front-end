/******************************************************************************\
|                                                                              |
|                           review-projects-list-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of projects for review.     |
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
	'text!templates/projects/review/review-projects-list/review-projects-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/projects/review/review-projects-list/review-projects-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, ReviewProjectsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ReviewProjectsListItemView,

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
				showNumbering: this.options.showNumbering
			}));
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				collection: this.collection,
				showDeactivatedProjects: this.options.showDeactivatedProjects,
				showNumbering: this.options.showNumbering,
				onChange: this.options.onChange,
				parent: this
			}
		},

		onRender: function() {

			// remove broken rows and shout out the indicies
			//
			this.$el.find('table').find('tbody tr').each( 
				function(index){
					if ($(this).children().length === 0) {
						// console.log(index);
						$(this).remove(); 
					}
				} 
			);

			// call superclass method
			//
			SortableTableListView.prototype.onRender.call(this);
		}
	});
});
