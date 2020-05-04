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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/review/review-projects-list/review-projects-list.tpl',
	'views/projects/list/projects-list-view',
	'views/projects/review/review-projects-list/review-projects-list-item-view'
], function($, _, Template, ProjectsListView, ReviewProjectsListItemView) {
	return ProjectsListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ReviewProjectsListItemView,

		// sort by date column in descending order 
		//
		sortBy: ['create-date', 'descending'],

		//
		// querying methods
		//

		viewFilter: function (child, index, collection) {
			return !child.model.isDeactivated() || this.options.showDeactivatedProjects;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection
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
			return {
				index: this.collection.indexOf(model),
				collection: this.collection,

				// options
				//
				showDeactivatedProjects: this.options.showDeactivatedProjects,
				onChange: this.options.onChange,
				parent: this
			};
		},

		/*
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
			ProjectsListView.prototype.onRender.call(this);
		}
		*/
	});
});
