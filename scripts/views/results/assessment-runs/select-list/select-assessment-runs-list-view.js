/******************************************************************************\
|                                                                              |
|                            assessment-runs-list-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a list of execution records.        |
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
	'backbone',
	'marionette',
	'registry',
	'bootstrap/popover',
	'text!templates/results/assessment-runs/select-list/select-assessment-runs-list.tpl',
	'collections/assessments/execution-records',
	'views/widgets/lists/sortable-table-list-view',
	'views/results/assessment-runs/select-list/select-assessment-runs-list-item-view'
], function($, _, Backbone, Marionette, Registry, PopOvers, Template, ExecutionRecords, SortableTableListView, SelectAssessmentRunsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: SelectAssessmentRunsListItemView,

		events: {
			'click .select-all': 'onClickSelectAll'
		},

		sorting: {

			// disable sorting on checkboxes and delete columns
			//
			headers: {
				0: { 
					sorter: false 
				},
				1: { 
					sorter: false 
				},
				9: {
					sorter: false
				},
				10: {
					sorter: false
				}
			},

			// sort on date column in descending order
			//
			sortList: [[6, 1]]
		},

		//
		// methods
		//

		initialize: function(options) {
			var self = this;

			// use specified sort order 
			//
			if (options.sortList) {
				this.sorting.sortList = options.sortList;
			} else if (this.options.showProjects) {
				this.sorting.sortList = [[6, 1]];
			} else {
				this.sorting.sortList = [[5, 1]];
			}

			// set attributes
			//
			this.shiftClicking = false;

			// add keyboard handlers
			//
			$(window).on('keydown', function(event) {
				self.onKeyDown(event);
			});
			$(window).on('keyup', function(event) {
				self.onKeyUp(event);
			});

			// call superclass method
			//
			SortableTableListView.prototype.initialize.call(this, _.extend(options, {
				showSortingColumn: true,
				groupExcept: ['select', 'delete', 'results', 'ssh']
			}));
		},

		//
		// selection methods
		//

		setAllSelected: function(checked) {
			var rows = this.$el.find('tbody').find('tr');
			for (var i = 0; i < rows.length; i++) {

				// set selectable select checkboxes
				//
				var select = $(rows[i]).find('input[name="select"]')[0];
				if (select && !$(select).hasClass('unselectable')) {
					$(select).prop('checked', checked);
				}

				// set select group checkboxes
				//
				var selectGroup = $(rows[i]).find('input[name="select-group"]')[0];
				if (selectGroup) {
					$(selectGroup).prop('checked', checked);
				}
			}
		},

		setSelectedRange: function(index1, index2, checked) {

			// swamp indices
			//
			if (index1 > index2) {
				var temp = index1;
				index1 = index2;
				index2 = temp;
			}

			// set range of checkboxes
			//
			var rows = this.$el.find('tbody').find('tr');
			for (var i = index1; i < index2; i++) {
				var select = $(rows[i]).find('input[name="select"]')[0];
				if (select && !$(select).hasClass('unselectable')) {
					$(select).prop('checked', checked);
				}
			}
		},

		setSelectedContiguous: function(index, checked) {
			var rows = this.$el.find('tbody').find('tr');
			var i = this.getFirstGroupIndex(index, checked);
			var done = false;
			var parity = $(rows[i]).hasClass('odd');

			while (i < rows.length && !done) {
				var $row = $(rows[i]);
				var rowParity = $row.hasClass('odd');

				if (rowParity == parity) {
					var select = $row.find('input[name="select"]')[0];
					if (select && !$(select).hasClass('unselectable')) {
						$(select).prop('checked', checked);
					}
				} else {
					done = true;
				}

				i++;
			}
		},

		selectAssessmentRuns: function(executionRecords) {
			for (var i = 0; i < executionRecords.length; i++) {
				this.selectAssessmentRun(executionRecords.at(i));
			}		
		},

		selectAssessmentRun: function(executionRecord) {
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children.findByIndex(i);
				if (child.model.isSameAs(executionRecord)) {
					child.setSelected(true);
				}
			}		
		},

		//
		// querying methods
		//

		getFirstGroupIndex: function(index, checked) {
			rows = this.$el.find('tbody').find('tr');
			var found = false;
			while (index >= 0 && !found) {
				row = rows[index];
				if ($(rows[index]).hasClass('first')) {
					return index;
				} else {
					index--;
				}
			}
			return 0;
		},
		
		getSelectedElementIndex: function(element) {
			var rows = this.$el.find('tbody').find('tr');
			for (var i = 0; i < rows.length; i++) {
				if ($(rows[i]).find('input[name="select"]')[0] == element) {
					return i;
				}
			}
		},

		getSelectedGroupElementIndex: function(element) {
			var rows = this.$el.find('tbody').find('tr');
			for (var i = 0; i < rows.length; i++) {
				if ($(rows[i]).find('input[name="select-group"]')[0] == element) {
					return i;
				}
			}
		},

		getSelected: function() {
			var collection = new ExecutionRecords();
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children.findByIndex(i);
				if (child.isSelected()) {
					collection.add(child.model);
				}
			}
			return collection;
		},

		getNumSelected: function() {
			var num = 0;
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children.findByIndex(i);
				if (child.isSelected()) {
					num++;
				}
			}
			return num;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				showGrouping: this.options.showGrouping,
				showStatus: this.options.showStatus,
				showErrors: this.options.showErrors,
				showDelete: this.options.showDelete,
				showSsh: this.options.showSsh
			}));
		},

		childViewOptions: function(model, index) {
			return {
				model: model,
				index: index,
				project: this.model,
				viewer: this.options.viewer,
				errorViewer: this.options.errorViewer,
				editable: this.options.editable,
				selected: this.options.selected,
				queryString: this.options.queryString,
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				showGrouping: this.options.showGrouping,
				showStatus: this.options.showStatus,
				showErrors: this.options.showErrors,
				showDelete: this.options.showDelete,
				showSsh: this.options.showSsh,
				parent: this
			};
		},

		onRender: function() {

			// call superclass method
			//
			SortableTableListView.prototype.onRender.call(this);

			// mark selected assessments
			//
			if (this.options.selectedExecutionRecords) {
				this.selectAssessmentRuns(this.options.selectedExecutionRecords);
			}

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		//
		// event handling methods
		//

		onSelect: function() {
			if (this.options.onSelect) {
				this.options.onSelect();
			}
		},

		onClickSelectAll: function(event) {
			this.setAllSelected($(event.target).prop('checked'));
			this.onSelect();
		},

		onKeyDown: function(event) {

			// find keycode of pressed key
			//
			if (event.which == 16) {

				// shft key pressed
				//
				this.shiftClicking = true;
			}
		},

		onKeyUp: function(event) { 

			// find keycode of pressed key
			//
			if (event.which == 16) {

				// shft key pressed
				//
				this.shiftClicking = false;
			}
		},

		//
		// cleanup methods
		//

		onBeforeUnload: function() {
			$(window).off('keydown');
			$(window).off('keyup');
		}
	});
});
