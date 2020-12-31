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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/info/versions/tool-versions-list/tool-versions-list.tpl',
	'models/utilities/version',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/tools/info/versions/tool-versions-list/tool-versions-list-item-view'
], function($, _, Template, Version, BaseView, SortableTableListView, ToolVersionsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ToolVersionsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No tool versions.")
		}),
		
		// sort by version column in descending order 
		//
		sortBy: ['version', 'descending'],

		// sort parsers required by table sorter
		//
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

		templateContext: function() {
			return {
				user: application.session.user,
				model: this.model,
				collection: this.collection,
				showDelete: this.options.showDelete
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
				user: application.session.user,
				model: model,
				tool: this.model,
				showDelete: this.options.showDelete
			};
		}
	});
});