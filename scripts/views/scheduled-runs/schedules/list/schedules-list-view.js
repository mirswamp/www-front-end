/******************************************************************************\
|                                                                              |
|                              schedules-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a project's current list of.        |
|        run request schedules.                                                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/scheduled-runs/schedules/list/schedules-list.tpl',
	'views/widgets/lists/table-list-view',
	'views/scheduled-runs/schedules/list/schedules-list-item-view'
], function($, _, Backbone, Marionette, Template, TableListView, SchedulesListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: SchedulesListItemView,

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				project: this.options.project,
				selectedAssessmentRunUuids: this.options.selectedAssessmentRunUuids,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}
		}
	});
});