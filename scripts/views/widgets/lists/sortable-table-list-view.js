/******************************************************************************\
|                                                                              |
|                            sortable-table-list-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view for displaying sortable lists.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'tablesorter',
	'views/widgets/lists/table-list-view'
], function($, _, Backbone, Marionette, TableSorter, TableListView) {
	return TableListView.extend({

		//
		// attributes
		//

		sorting: {

			// sort on first version column in ascending order 
			//
			sortList: [[0, 0]] 
		},

		//
		// methods
		//

		initialize: function(options) {
			var self = this;

			// set attributes
			//
			if (options && options.sorting) {
				this.sorting = options.sorting;
			}
			this.options = options;
			
			// call superclass method
			//
			TableListView.prototype.initialize.call(this);

			// renumber after sorting
			//
			this.$el.bind('sortStart',function() {
				self.onSortStart();
			});
			this.$el.bind('sortEnd',function() {
				self.onSortEnd();
			});

			// add specialized sort parsers
			//
			if (this.sortParsers) {
				for (var i = 0; i < this.sortParsers.length; i++) {
					$.tablesorter.addParser(this.sortParsers[i]);
				}
			}

			// update after a model is deleted
			//
			this.collection.on('destroy', function() {
				self.onSortEnd();
			})
		},

		update: function() {
				
			// call superclass method
			//
			TableListView.prototype.update.call(this);

			// update tablesorter cache upon update
			//
			this.$el.find('.tablesorter').trigger('update');
		},

		sortItems: function(sorting) {

			// apply table sorter tag
			//
			this.$el.find('table').addClass('tablesorter');
			
			// apply table sorter plug-in
			//
			if (this.options.showNumbering) {
				this.$el.find('.tablesorter:has(tbody tr)').tablesorter(this.getNumberedSorting(sorting));
			} else {
				this.$el.find('.tablesorter:has(tbody tr)').tablesorter(sorting);
			}
		},

		//
		// querying methods
		//

		getSortList: function() {
			var column;
			var direction;

			// find sorting column and direction
			//
			if (this.$el.find('table .headerSortUp').length > 0) {
				var el = this.$el.find('table .headerSortUp')[0];
				column = el.column;
				direction = 1;
			} else if (this.$el.find('table .headerSortDown').length > 0) {
				var el = this.$el.find('table .headerSortDown')[0];
				column = el.column;
				direction = 0;
			}

			// return sort list array
			//
			if (column != undefined && direction != undefined) {
				if (this.options.showNumbering) {
					return [[column - 1, direction]];
				} else {
					return [[column, direction]];
				}
			}
		},

		getNumberedSorting: function(sorting) {

			// disable sorting on number column
			//
			var headers = {
				0: {
					sorter: false
				}
			};

			// add sorters of other columns
			//
			if (sorting.headers) {
				for (var key in sorting.headers) {
					headers[parseInt(key) + 1] = {
						sorter: sorting.headers[key].sorter
					}
				}
			}

			// add one to sort column
			//
			if (sorting.sortList) {
				var column = sorting.sortList[0][0];
				var direction = sorting.sortList[0][1];
				var sortList = [[column + 1, direction]];
			}

			// return sorting info
			//
			return {
				headers: headers,
				sortList: sortList
			}
		},

		getSortColumnIndex: function() {
			var index = undefined;
			var headerColumns = this.$el.find('thead th');
			for (var i = 0; i < headerColumns.length; i++) {
				if ($(headerColumns[i]).hasClass('headerSortDown') || 
					$(headerColumns[i]).hasClass('headerSortUp')) {
					return i;
				}
			}
		},

		markDuplicateCells: function(exceptions) {
			var columns = this.$el.find('thead th');
			var rows = this.$el.find('tbody tr');

			// remove duplicate tags
			//
			if (exceptions) {
				var cells = this.$el.find('td');
				for (var i = 0; i < cells.length; i++) {
					if (this.constructor.cellContainsClass(cells[i], exceptions)) {
						$(cell).removeClass('duplicate');
					}
				}
			} else {
				this.$el.find('td').removeClass('duplicate');
			}

			// iterate over each column
			//
			for (var column = 0; column < columns.length; column++) {
				var item = this.$el.find('thead th')[column];

				// skip exception columns
				//
				if (exceptions) {
					if (this.constructor.cellContainsClass(item, exceptions)) {
						continue;
					}
				}

				// iterate over rows
				//
				for (var row = 0; row <= rows.length; row++) {
					var cell = $(rows[row]).find('td')[column];

					if (row == 0) {

						// always show first row
						//
						if ($(cell).hasClass('duplicate')) {
							$(cell).removeClass('duplicate')
						}
					} else {

						// check to see if item in row equals previous
						//
						var previous = $(rows[row - 1]).find('td')[column];

						if ($(cell).html() == $(previous).html()) {

							// hide cell contents
							//
							$(cell).addClass('duplicate');
						} else {

							// show cell contents
							//
							$(cell).removeClass('duplicate');						
						}
					}
				}
			}

			// find sorting column
			//
			if (this.options.showSortingColumn) {
				var sortColumnIndex = this.getSortColumnIndex();
				if (sortColumnIndex) {

					// mark first of each group
					//
					for (var row = 0; row <= rows.length; row++) {
						var cell = $(rows[row]).find('td')[sortColumnIndex];

						if (row == 0 || !$(cell).hasClass('duplicate')) {
							$(rows[row]).addClass('first');
						} else {
							$(rows[row]).removeClass('first');
						}
					}

					// mark last of each group
					//
					for (var row = 0; row < rows.length; row++) {
						if ($(rows[row + 1]).hasClass('first')) {
							$(rows[row]).addClass('last');
						}
					}
					$(rows[rows.length - 1]).addClass('last');

					// mark even odd grouping
					//	
					var order = "even";
					for (var row = 0; row <= rows.length; row++) {
						var cell = $(rows[row]).find('td')[sortColumnIndex];

						if (row == 0 || !$(cell).hasClass('duplicate')) {

							// switch from even to odd
							//
							order = order == "even"? "odd" : "even";
						}

						$(rows[row]).removeClass('even');
						$(rows[row]).removeClass('odd');
						$(rows[row]).addClass(order);
					}
				}
			}
		},

		//
		// rendering methods
		//

		onShow: function() {

			// call superclass items
			//
			TableListView.prototype.onRender.call(this);

			// perform initial sort
			//
			if (this.sorting) {
				this.sortItems(this.sorting);
			}
		},

		//
		// event handing methods
		//

		onSortStart: function() {
		},

		onSortEnd: function() {

			// renumber, if necessary
			//
			if (this.options.showNumbering) {
				this.renumber();
			}

			// mark duplicates, if neccessary
			//
			if (this.options.showGrouping) {
				this.markDuplicateCells(this.options.groupExcept);
			}
		}
	}, {

		//
		// static methods
		//

		cellContainsClass: function(item, classNames) {
			for (var i = 0; i < classNames.length; i++) {
				if ($(item).hasClass(classNames[i])) {
					return true;
				}
			}
			return false;
		}
	});
});