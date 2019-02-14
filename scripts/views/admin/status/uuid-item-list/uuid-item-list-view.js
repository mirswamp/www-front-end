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
	'backbone',
	'marionette',
	'text!templates/admin/status/uuid-item-list/uuid-item-list.tpl',
	'views/admin/status/item-list/item-list-view',
	'views/admin/status/uuid-item-list/uuid-item-list-item-view'
], function($, _, Backbone, Marionette, Template, ItemListView, UuidItemListItemView) {
	return ItemListView.extend({

		//
		// attributes
		//

		childView: UuidItemListItemView,

		//
		// rendering methods
		//

		template: function(data) {
			if (this.collection.length > 0) {
				return _.template(Template, _.extend(data, {
					fieldnames: this.options.fieldnames,
					showNumbering: this.options.showNumbering
				}));
			} else {
				return _.template("No items.");
			}
		}
	});
});
