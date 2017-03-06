/******************************************************************************\
|                                                                              |
|                            package-versions-list-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a list of package versions.         |
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
	'text!templates/packages/info/versions/list/package-versions-list.tpl',
	'registry',
	'models/utilities/version',
	'views/widgets/lists/sortable-table-list-view',
	'views/packages/info/versions/list/package-versions-list-item-view'
], function($, _, Backbone, Marionette, Template, Registry, Version, SortableTableListView, PackageVersionsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: PackageVersionsListItemView,

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
				model: this.model,
				collection: this.collection,
				showDelete: this.model.isOwned()
			}));
		},

		childViewOptions: function(model) {
			return {
				model: model,
				package: this.model,
				collection: this.collection
			}   
		}
	});
});