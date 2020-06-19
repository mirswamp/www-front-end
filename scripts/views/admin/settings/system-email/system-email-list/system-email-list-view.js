/******************************************************************************\
|                                                                              |
|                            system-email-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing the system email users.               |
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
	'bootstrap/popover',
	'text!templates/admin/settings/system-email/system-email-list/system-email-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/admin/settings/system-email/system-email-list/system-email-list-item-view'
], function($, _, Popover, Template, BaseView, SortableTableListView, SystemEmailListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: SystemEmailListItemView,

		emptyView: BaseView.extend({
			template: _.template("No emails.")
		}),

		events: {
			'click .select-all': 'onClickSelectAll'
		},

		// sort by date column in ascending order 
		//
		// sortBy: ['email', 'ascending'],

		//
		// constructor
		//

		initialize: function(options) {

			// set optional parameter defaults
			//
			if (this.options.start == undefined) {
				this.options.start = 0;
			}
			if (this.options.showHibernate == undefined) {
				this.options.showHibernate = true;
			}

			// call superclass method
			//
			SortableTableListView.prototype.initialize.call(this, _.extend(options, {
				sorting: this.sorting
			}));
		},

		//
		// querying methods
		//

		getSelectedElementIndex: function(element) {
			var elements = this.$el.find('input[name="select"]');
			for (var i = 0; i < elements.length; i++) {
				if (element == elements[i]) {
					return i;
				}
			}
		},

		//
		// setting methods
		//

		/*
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
		*/

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				groupSelected: this.options.groupSelected,
				showHibernate: this.options.showHibernate
			};
		},
		
		onRender: function() {

			// call superclass method
			//
			SortableTableListView.prototype.onRender.call(this);

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// set starting line number
			//
			this.$el.css('counter-reset', 'row-number ' + this.options.start);
		},
		
		childViewOptions: function(model) {
			var index = this.collection.indexOf(model);

			// return view options
			//
			return {
				index: this.options.start + index,
				showHibernate: this.options.showHibernate,
				parent: this,

				// callbacks
				//
				onClick: this.options.onClick
			};
		},

		//
		// mouse event handling methods
		//

		onClickSelectAll: function(event) {
			var checked = $(event.target).prop('checked');
			if (checked) {

				// select all
				//
				this.options.parent.selectAll();
			} else {
				
				// deselect all
				//
				this.options.parent.deselectAll();
			}
		}
	});
});