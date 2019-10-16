/******************************************************************************\
|                                                                              |
|                              table-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view for displaying a generic list.          |
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
	'views/base-view',
	'views/collections/lists/list-view',
	'views/collections/tables/table-list-item-view'
], function($, _, BaseView, ListView, TableListItemView) {
	return ListView.extend({

		//
		// attributes
		//

		tagName: 'table',
		childView: TableListItemView,
		childViewContainer: 'tbody',

		emptyView: BaseView.extend({
			template: _.template("No items.")
		}),

		//
		// constuctor
		//

		initialize: function() {

			// update view on collection change
			//
			this.listenTo(this.collection, 'remove', this.update, this);
		},

		//
		// rendering methods
		//

		onAttach: function() {
			this.update();
		},

		update: function() {
			if (this.collection.isEmpty()) {
				this.$el.find('thead').hide();
			} else {
				this.$el.find('thead').show();
			}
		},

		attachHtml: function(elements, $container) {
			this.Dom.appendContents($(this.el).find('tbody'), elements);
		}
	});
});