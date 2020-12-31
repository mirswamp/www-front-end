/******************************************************************************\
|                                                                              |
|                         restricted-domains-list-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing the domains that are restricted       |
|        for use for user verification.                                        |
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
	'text!templates/admin/settings/restricted-domains/restricted-domains-list/restricted-domains-list.tpl',
	'views/base-view',
	'views/collections/tables/table-list-view',
	'views/admin/settings/restricted-domains/restricted-domains-list/restricted-domains-list-item-view'
], function($, _, Template, BaseView, TableListView, RestrictedDomainsListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: RestrictedDomainsListItemView,
		className: 'input',

		emptyView: BaseView.extend({
			template: _.template("No restricted domains.")
		}),

		// sort by domain-name column in ascending order
		//
		// sortBy: ['domain-name', 'ascending'],

		//
		// constructor
		//

		/*
		initialize: function(options) {

			// call superclass constructor
			//
			SortableTableListView.prototype.initialize.call(this, options);

			// add parser for input elements
			//
			$.tablesorter.addParser({ 
				id: "input", 
				is: function(s, table, cell, $cell) { 
					return table.className.contains('input');
				}, 
				format: function(s, t, node) {
					return $(node).find('input').val();
				}, 
				type: "text" 
			});
		},
		*/

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showDelete: this.options.showDelete
			};
		},

		childViewOptions: function() {
			return {
				showDelete: this.options.showDelete
			};
		}
	});
});
