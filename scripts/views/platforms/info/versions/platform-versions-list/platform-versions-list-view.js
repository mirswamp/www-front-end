/******************************************************************************\
|                                                                              |
|                          platform-versions-list-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a list of platform versions.        |
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
	'text!templates/platforms/info/versions/platform-versions-list/platform-versions-list.tpl',
	'models/utilities/version',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/platforms/info/versions/platform-versions-list/platform-versions-list-item-view'
], function($, _, Template, Version, BaseView, SortableTableListView, PlatformVersionsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: PlatformVersionsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No platform versions.")
		}),

		// sort by package column in descending order 
		//
		sortBy: ['version_string', 'descending'],

		// parsers needed by table sorter
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
				model: model,
				platform: this.model
			};
		}
	});
});