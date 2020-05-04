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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'jquery.tablesorter',
	'views/collections/tables/table-list-view'
], function($, _, TableSorter, TableListView) {
	return TableListView.extend({

		//
		// attributes
		//

		// by default, disable sorting on selected columns
		//
		unsorted: ['number', 'select-group', 'select', 'delete'],

		//
		// constructor
		//

		initialize: function() {
			var self = this;
			
			// call superclass method
			//
			TableListView.prototype.initialize.call(this);

			// set attributes
			//
			if (this.options.sortBy) {
				this.sortBy = this.options.sortBy;
			}

			// apply table sorter tag
			//
			this.$el.addClass('tablesorter');

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
				self.$el.trigger("update");
			});

			// renumber after sorting
			//
			this.$el.bind('sortStart',function() {
				self.onSortStart();
			});
			this.$el.bind('sortEnd',function() {
				self.onSortEnd();
			});
		},

		sortItems: function(sorting) {

			// if sorting is not specified, then use previous
			//
			if (!sorting) {
				sorting = this.sorting;
			}

			// check if there are items to sort
			//
			if (this.collection.length == 0) {
				return;
			}
			
			// apply table sorter plug-in
			//
			this.$el.tablesorter(sorting);

			// set attributes
			//
			this.sorting = sorting;

			// finish sorting
			//
			this.onSortEnd();
		},

		//
		// querying methods
		//

		getTableColumnIndex: function(className) {
			var tableHeaders = this.$el.find('th');
			for (var i = 0; i < tableHeaders.length; i++) {
				var tableHeader = tableHeaders[i];
				var classNames = tableHeader.className.split(' ');
				if (classNames.contains(className)) {
					return i; 
				}
			}
		},

		getSorting: function() {

			// get sorting column
			//
			var cell = this.$el.find('th.tablesorter-headerAsc, th.tablesorter-headerDesc')[0];
			if (cell) {
				var classNames = cell.className.split(' ');
				var className;
				for (var i = 0; i < classNames.length; i++) {
					className = classNames[i];
					if (!['first', 'last', 'selected', 'tablesorter-headerAsc', 'tablesorter-headerDesc'].contains(className)) {
						break;
					}
				} 

				// return column ascending or descending
				//
				if (classNames.contains('tablesorter-headerAsc')) {
					return [className, 'ascending'];
				} else {
					return [className, 'descending'];
				}
			}
		},

		getSortList: function() {
			var column;
			var direction;

			// find sorting column and direction
			//
			var index = this.getTableColumnIndex('tablesorter-headerAsc');
			if (index) {
				column = index;
				direction = 1;
			}

			if (index == undefined) {
				index = this.getTableColumnIndex('tablesorter-headerDesc');
				if (index) {
					column = index;
					direction = 0;
				}
			}

			// return sort list array
			//
			if (column != undefined && direction != undefined) {
				return [[column, direction]];
			}
		},

		getSortColumnIndex: function() {
			var headerColumns = this.$el.find('thead th');
			for (var i = 0; i < headerColumns.length; i++) {
				if ($(headerColumns[i]).hasClass('tablesorter-headerAsc') || 
					$(headerColumns[i]).hasClass('tablesorter-headerDesc')) {
					return i;
				}
			}
		},

		setSortColumn: function(className, direction) {
			var index = this.getTableColumnIndex(className);

			// set sorting on specified column
			//		
			if (index != undefined) {
				if (!this.sorting) {
					this.sorting = {};
				}
				switch (direction) {
					case 'ascending':
						this.sorting.sortList = [[index, 0]];
						break;
					case 'descending':
						this.sorting.sortList = [[index, 1]];
						break;
				}				
			}
		},

		disableSortingOnColumn: function(className) {
			var index = this.getTableColumnIndex(className);

			// disable sorting on column[index]
			//
			if (index != undefined) {
				if (!this.sorting) {
					this.sorting = {};
				}
				if (!this.sorting.headers) {
					this.sorting.headers = {};
				}
				if (!this.sorting.headers[index]) {
					this.sorting.headers[index] = {};
				}

				this.sorting.headers[index].sorter = false;
			}
		},

		//
		// rendering methods
		//

		onRender: function() {

			// call superclass method
			//
			TableListView.prototype.onRender.call(this);

			// find column to sort by
			//
			if (this.sortBy) {
				this.setSortColumn(this.sortBy[0], this.sortBy[1]);
			}

			// find columns to avoid sorting
			//
			if (this.unsorted) {
				for (var i = 0; i < this.unsorted.length; i++) {
					var className = this.unsorted[i];
					this.disableSortingOnColumn(className);
				}
			}

			// perform initial sort
			//
			if (this.sorting) {
				this.sortItems();
			}
		},

		//
		// event handing methods
		//

		onSortStart: function() {
		},

		onSortEnd: function() {
		}
	});
});