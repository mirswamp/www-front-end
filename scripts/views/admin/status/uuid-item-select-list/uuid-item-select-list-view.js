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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/admin/status/uuid-item-select-list/uuid-item-select-list.tpl',
	'views/base-view',
	'views/admin/status/uuid-item-list/uuid-item-list-view',
	'views/admin/status/uuid-item-select-list/uuid-item-select-list-item-view'
], function($, _, Template, BaseView, UuidItemListView, UuidItemSelectListItemView) {
	return UuidItemListView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		childView: UuidItemSelectListItemView,

		emptyView: BaseView.extend({
			template: _.template("No items.")
		}),
		
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

		templateContext: function() {
			return {
				fieldnames: this.options.fieldnames
			};
		},

		childViewOptions: function(model) {

			// check if empty view
			//
			if (!model) {
				return {};
			}

			var execRunUuid = model.get('EXECRUNUID');
			var end = execRunUuid.indexOf('}');
			if (end != -1) {
				execRunUuid = execRunUuid.substr(end + 1);
			}

			// return view options
			//
			selected = this.options.selected? this.options.selected.findWhere({
				EXECRUNUID: execRunUuid
			}) : null;

			return {
				model: model,
				index: this.collection.indexOf(model),
				selected: (selected != null),
				fieldnames: this.options.fieldnames
			};
		},

		//
		// event handling methods
		//
		
		onClickSelectAll: function(event) {
			this.$el.find('input').prop('checked', $(event.target).prop('checked'));
		}
	});
});
