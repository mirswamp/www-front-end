/******************************************************************************\
|                                                                              |
|                            tool-versions-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a list of tool versions.            |
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
	'text!templates/tools/info/versions/tool-versions-list/tool-versions-list.tpl',
	'registry',
	'models/utilities/version',
	'views/widgets/lists/sortable-table-list-view',
	'views/tools/info/versions/tool-versions-list/tool-versions-list-item-view'
], function($, _, Backbone, Marionette, Template, Registry, Version, SortableTableListView, ToolVersionsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ToolVersionsListItemView,

		sorting: {

			// disable sorting on delete column
			//
			headers: {
				0: {
					sorter: 'versions'
				},

				3: { 
					sorter: false 
				}
			},

			// sort on version column in descending order 
			//
			sortList: [[0, 1]] 
		},

		sortParsers: [{

			// set a unique id 
			//
			id: 'versions',

			is: function(s) {

				// return false so this parser is not auto detected 
				//
				return false;
			},

			format: function(string) {
				return Version.comparator(string);
			},

			// set type, either numeric or text
			//
			type: 'numeric'
		}],

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				user: Registry.application.session.user,
				model: this.model,
				collection: this.collection,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(model) {
			return {
				user: Registry.application.session.user,
				model: model,
				tool: this.model,
				showDelete: this.options.showDelete
			}   
		}
	});
});