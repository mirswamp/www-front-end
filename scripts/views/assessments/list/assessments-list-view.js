/******************************************************************************\
|                                                                              |
|                             assessments-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a project's current list of.        |
|        assessments.                                                          |
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
	'text!templates/assessments/list/assessments-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/assessments/list/assessments-list-item-view'
], function($, _, Backbone, Marionette, Template, SortableTableListView, AssessmentsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: AssessmentsListItemView,

		sorting: {

			// disable sorting on delete column
			//
			headers: {
				3: { 
					sorter: false 
				}
			},

			// sort on name in ascending order 
			//
			sortList: [[0, 0]]
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
				showNumbering: this.options.showNumbering
			}
		}
	});
});