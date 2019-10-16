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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
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

		emptyView: BaseView.extend({
			template: _.template("No restricted domains.")
		}),

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
