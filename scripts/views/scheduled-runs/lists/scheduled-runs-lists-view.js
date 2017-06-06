/******************************************************************************\
|                                                                              |
|                             scheduled-runs-lists-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for multiple lists of scheduled runs.           |
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
	'text!templates/scheduled-runs/lists/scheduled-runs-lists.tpl',
	'views/scheduled-runs/list/scheduled-runs-list-view'
], function($, _, Backbone, Marionette, Template, ScheduledRunsListView) {
	return Backbone.Marionette.CompositeView.extend({

		//
		// attributes
		//

		childView: ScheduledRunsListView,

		//
		// methods 
		//

		buildChildView: function(child, ChildViewClass, childViewOptions) {

			// create the child view instance
			//
			return new ScheduledRunsListView(_.extend({
				model: child.get('run_request'),
				collection: child.get('collection')
			}, {
				showNumbering: this.options.showNumbering,
				showSchedule: this.options.showSchedule,
				showDelete: this.options.showDelete,
				parent: this
			}));
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
	});
});