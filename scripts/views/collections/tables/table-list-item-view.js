/******************************************************************************\
|                                                                              |
|                            table-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view that shows a single list item.          |
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
	'views/collections/lists/list-item-view'
], function($, _, ListItemView) {
	return ListItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		// prepended and appended columns
		//
		prepended: ['number', 'select-group', 'select'],
		appended: ['delete'],

		//
		// rendering methods
		//

		onRender: function() {

			// mark non-shaded table cells
			//
			this.markPrependedTableCells(this.$el.find('th, td'));
			this.markAppendedTableCells(this.$el.find('th, td'));

			// mark first and last table cells (for rounded corners)
			//
			this.markFirstTableCells();
			this.markLastTableCells();
		},

		markPrependedTableCells: function(elements) {
			for (var i = 0; i < elements.length; i++) {
				var element = $(elements[i]);

				loop2:
					for (var j = 0; j < this.prepended.length; j++) {
						var className = this.prepended[j];

						if (element.hasClass(className)) {
							element.addClass('prepend');
							break loop2;
						}
					}
			}
		},

		markAppendedTableCells: function(elements) {
			for (var i = 0; i < elements.length; i++) {
				var element = $(elements[i]);

				loop2:
					for (var j = 0; j < this.appended.length; j++) {
						var className = this.appended[j];

						if (element.hasClass(className)) {
							element.addClass('append');
							break loop2;
						}
					}
			}
		},
		
		markFirstTableCells: function() {
			var index;

			// find first non prepended column
			//
			var cells = this.$el.find('td');
			for (var i = 0; i < cells.length; i++) {
				var cell = cells[i];
				if (!cell.className.contains('prepend')) {
					index = i;
					break;
				}
			}
			$(cells[index]).addClass('first');
		},

		markLastTableCells: function() {
			var index;

			// find last non appended column
			//
			var cells = this.$el.find('td');
			for (var i = 0; i < cells.length; i++) {
				var cell = cells[i];
				if (!cell.className.contains('append')) {
					index = i;
				}
			}
			$(cells[index]).addClass('last');
		}
	});
});