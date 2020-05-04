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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
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

		// prepended and appended columns
		//
		prepended: ['number', 'select-group', 'select'],
		appended: ['delete'],

		//
		// constuctor
		//

		initialize: function() {

			// update view on collection change
			//
			this.listenTo(this.collection, 'remove', this.update, this);
		},

		//
		// numbering methods
		//

		setShowNumbering: function(showNumbering) {
			if (showNumbering) {
				this.$el.addClass('numbered');
			} else {
				this.$el.removeClass('numbered');
			}
		},

		//
		// rendering methods
		//

		onRender: function() {

			// call superclass method
			//
			ListView.prototype.onRender.call(this);

			// mark non-shaded table cells
			//
			this.markPrependedTableCells(this.$el.find('th, td'));
			this.markAppendedTableCells(this.$el.find('th, td'));

			// mark first and last table cells (for rounded corners)
			//
			this.markFirstTableCells();
			this.markLastTableCells();

			// add optional numbering
			//
			if (application.options.showNumbering) {
				this.setShowNumbering(true);
			}
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
			var cells = this.$el.find('th');
			for (var i = 0; i < cells.length; i++) {
				var cell = cells[i];
				if (!cell.className.contains('prepend')) {
					index = i;
					break;
				}
			}
			$(cells[index]).addClass('first');

			// mark first cell of each row
			//
			var rows = this.$el.find('tr');
			for (var j = 0; j < rows.length; j++) {
				var row = rows[j];
				cells = $(row).find('td');
				$(cells[index]).addClass('first');
			}
		},

		markLastTableCells: function() {
			var index;

			// find last non appended column
			//
			var cells = this.$el.find('th');
			for (var i = 0; i < cells.length; i++) {
				var cell = cells[i];
				if (!cell.className.contains('append')) {
					index = i;
				}
			}
			$(cells[index]).addClass('last');

			// mark last cell of each row
			//
			var rows = this.$el.find('tr');
			for (var j = 0; j < rows.length; j++) {
				var row = rows[j];
				cells = $(row).find('td');
				$(cells[index]).addClass('last');
			}
		},

		onAttach: function() {
			this.update();
			
			// We shouldn't need to do this, but since the table
			// head structure is being added even for empty tables, 
			// we must hide it if the table is empty.
			//
			if (this.collection.isEmpty()) {
				this.$el.find('thead').hide();
			} else {
				this.$el.find('thead').show();
			}
		},

		attachHtml: function(elements, $container) {

			// mark non-shaded table cells
			//
			this.markPrependedTableCells($(elements).find('td'));
			this.markAppendedTableCells($(elements).find('td'));

			// add elements to DOM
			//
			this.Dom.appendContents($(this.el).find('tbody'), elements);
		}
	});
});