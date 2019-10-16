/******************************************************************************\
|                                                                              |
|                          select-assessments-list-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a project's current list of.        |
|        assessments.                                                          |
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
	'bootstrap/popover',
	'text!templates/assessments/select-list/select-assessments-list.tpl',
	'collections/assessments/assessment-runs',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/assessments/select-list/select-assessments-list-item-view'
], function($, _, Popover, Template, AssessmentRuns, BaseView, SortableTableListView, SelectAssessmentsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: SelectAssessmentsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No assessments.")
		}),

		events: {
			'click .select-all': 'onClickSelectAll',
			'keydown': 'onKeyDown',
			'keyup': 'onKeyUp'
		},

		sorting: {

			// disable sorting on select column
			//
			headers: { 
				0: { 
					sorter: false 
				},
				1: { 
					sorter: false 
				},
				6: { 
					sorter: false 
				}
			},

			// sort on name column in ascending order 
			//
			sortList: [[2, 0]]
		},

		groupExcept: ['select-group', 'select', 'results', 'delete'],

		//
		// constructor
		//

		initialize: function(options) {
			var self = this;

			// use specified sort order 
			//
			if (options.sortList) {
				this.sorting.sortList = options.sortList;
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
				showSortingColumn: true
			}));
		},

		//
		// selection methods
		//

		setAllSelected: function(checked) {
			var rows = this.$el.find('tbody').find('tr');
			for (var i = 0; i < rows.length; i++) {
				var select = $(rows[i]).find('input[name="select"]')[0];
				if (select && !$(select).hasClass('unselectable')) {
					$(select).prop('checked', checked);
				}
			}
		},

		setSelectedRange: function(index1, index2, checked) {

			// swap indices
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

		selectAssessments: function(assessments) {
			for (var i = 0; i < assessments.length; i++) {
				this.selectAssessment(assessments.at(i));
			}		
		},

		selectAssessment: function(assessment) {
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children.findByIndex(i);
				if (child.model.isSameAs(assessment)) {
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
			var elements = this.$el.find('input[name="select"]');
			for (var i = 0; i < elements.length; i++) {
				if (element == elements[i]) {
					return i;
				}
			}
		},

		getSelectedGroupElementIndex: function(element) {
			var elements = this.$el.find('input[name="select-group"]');
			for (var i = 0; i < elements.length; i++) {
				if (element == elements[i]) {
					return i;
				}
			}
		},

		getSelected: function() {
			var collection = new AssessmentRuns();
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children.findByIndex(i);
				if (child.isSelected()) {
					collection.add(child.model);
				}
			}
			return collection;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				showGrouping: this.options.showGrouping,
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
				index: this.collection.indexOf(model),
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				showGrouping: this.options.showGrouping,
				showDelete: this.options.showDelete,
				project: this.options.project,
				data: this.options.data,
				parent: this
			};
		},

		onRender: function() {

			// call superclass method
			//
			SortableTableListView.prototype.onRender.call(this);

			// mark selected assessments
			//
			if (this.options.selectedAssessments) {
				this.selectAssessments(this.options.selectedAssessments);
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

			// perform callback
			//
			if (this.options.onSelect) {
				this.options.onSelect();
			}
		},

		onClickSelectAll: function(event) {
			if ($(event.target).prop('checked')) {

				// select all
				//
				this.$el.find('input').prop('checked', true);
			} else {
				
				// deselect all
				//
				this.$el.find('input').prop('checked', false);
			}
			
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