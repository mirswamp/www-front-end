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

		// sort by date column in ascending order 
		//
		sortBy: ['username', 'ascending'],

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

		templateContext: function() {
			return {
				collection: this.collection,
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
				showHibernate: this.options.showHibernate
			};
		}
	});
});