/******************************************************************************\
|                                                                              |
|                           uuid-item-select-list-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a generic list of named items      |
|        or uuids with checkboxes.                                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/status/uuid-item-select-list/uuid-item-select-list.tpl',
	'views/admin/status/uuid-item-list/uuid-item-list-view',
	'views/admin/status/uuid-item-select-list/uuid-item-select-list-item-view'
], function($, _, Backbone, Marionette, Template, UuidItemListView, UuidItemSelectListItemView) {
	return UuidItemListView.extend({

		//
		// attributes
		//

		childView: UuidItemSelectListItemView,
		
		events: {
			'click .select-all': 'onClickSelectAll'
		},

		sorting: {
			headers: {
				0: {
					sorter: false
				},
			}
		},

		//
		// querying methods
		//
		
		getSelected: function() {
			var collection = new Backbone.Collection();
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

		template: function(data) {
			if (this.collection.length > 0) {
				return _.template(Template, _.extend(data, {
					fieldnames: this.options.fieldnames,
					showNumbering: this.options.showNumbering
				}));
			} else {
				return _.template("No items.")
			}
		},

		childViewOptions: function(model, index) {
			selected = this.options.selected? this.options.selected.findWhere({
				EXECRUNUID: model.get('EXECRUNUID')
			}) : null;

			return {
				model: model,
				index: index,
				selected: (selected != null),
				fieldnames: this.options.fieldnames,
				showNumbering: this.options.showNumbering
			}
		},

		//
		// event handling methods
		//
		
		onClickSelectAll: function(event) {
			this.$el.find('input').prop('checked', $(event.target).prop('checked'));
		}
	});
});
