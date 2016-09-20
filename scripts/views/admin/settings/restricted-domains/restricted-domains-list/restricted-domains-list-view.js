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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/settings/restricted-domains/restricted-domains-list/restricted-domains-list.tpl',
	'views/widgets/lists/table-list-view',
	'views/admin/settings/restricted-domains/restricted-domains-list/restricted-domains-list-item-view'
], function($, _, Backbone, Marionette, Template, TableListView, RestrictedDomainsListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: RestrictedDomainsListItemView,

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function() {
			return {
				showDelete: this.options.showDelete
			}
		}
	});
});
