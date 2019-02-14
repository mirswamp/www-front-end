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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/popover',
	'text!templates/admin/settings/system-email/system-email-list/system-email-list.tpl',
	'views/widgets/lists/sortable-table-list-view',
	'views/admin/settings/system-email/system-email-list/system-email-list-item-view'
], function($, _, Backbone, Marionette, Popover, Template, SortableTableListView, SystemEmailListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: SystemEmailListItemView,

		sorting: {

			// disable sorting on remove column
			//
			headers: { 
				0: { 
					sorter: false 
				}
			},

			// sort on name column in ascending order 
			//
			sortList: [[1, 0]] 
		},

		//
		// constructor
		//

		initialize: function(options) {

			// set optional parameter defaults
			//
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
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showNumbering: this.options.showNumbering,
				showHibernate: this.options.showHibernate
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				showNumbering: this.options.showNumbering,
				showHibernate: this.options.showHibernate
			}
		}
	});
});
