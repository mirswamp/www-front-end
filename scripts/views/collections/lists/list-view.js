/******************************************************************************\
|                                                                              |
|                                 list-view.js                                 |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'views/base-view',
	'views/collections/collection-view',
	'views/collections/lists/list-item-view'
], function($, _, BaseView, CollectionView, ListItemView) {
	return CollectionView.extend({

		//
		// attributes
		//

		childView: ListItemView,
		emptyView: BaseView.extend({
			template: _.template("No items.")
		}),

		//
		// constructor
		//

		initialize: function() {

			// watch collection
			//
			this.listenTo(this.collection, 'add', this.update, this);
			this.listenTo(this.collection, 'remove', this.update, this);
		},

		//
		// methods
		//

		update: function() {

			// renumber (if list is numbered)
			//
			this.renumber();
		},

		renumber: function() {
			var count = 1;
			this.$el.find('td.number').each(function() {
				$(this).html(count++);
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			this.$el.find('table').wrap('<div class="table-responsive"></div>');
		}
	});
});