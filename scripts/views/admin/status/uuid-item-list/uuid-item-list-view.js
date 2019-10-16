/******************************************************************************\
|                                                                              |
|                              uuid-item-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a generic list of named items      |
|        or uuids.                                                             |
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
	'text!templates/admin/status/uuid-item-list/uuid-item-list.tpl',
	'views/base-view',
	'views/admin/status/item-list/item-list-view',
	'views/admin/status/uuid-item-list/uuid-item-list-item-view'
], function($, _, Template, BaseView, ItemListView, UuidItemListItemView) {
	return ItemListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: UuidItemListItemView,
		
		emptyView: BaseView.extend({
			template: _.template("No items.")
		}),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				fieldnames: this.options.fieldnames,
				showNumbering: this.options.showNumbering
			};
		}
	});
});
