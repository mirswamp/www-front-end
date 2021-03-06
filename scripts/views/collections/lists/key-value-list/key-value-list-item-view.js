/******************************************************************************\
|                                                                              |
|                           route-list-item-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a single api method / route.           |
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
	'text!templates/collections/lists/key-value-list/key-value-list-item.tpl',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'keydown .value': 'onKeyDownValue',
			'input .key': 'onInputKey',
			'input .value': 'onInputValue',
			'click .reorder button.move-down': 'onClickMoveDown',
			'click .reorder button.move-up': 'onClickMoveUp',
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				index: this.options.index,
				num: this.collection.length,
				editable: this.options.editable,
				showDelete: this.options.showDelete
			};
		},

		onKeyDownValue: function() {

			// clear cell
			//
			if (!this.model.has('value')) {
				this.$el.find('td.value').html('');
			}
		},

		onInputKey: function() {

			// update model
			//
			this.model.set({
				key: this.$el.find('td.key').html().trim()
			});

			this.onChange();
		},

		onInputValue: function() {

			// update model
			//
			this.model.set({
				value: this.$el.find('td.value').html().trim()
			});

			this.onChange();
		},

		onClickMoveDown: function() {
			var index = this.collection.indexOf(this.model);

			// remove from collection
			//
			this.collection.remove(this.model, {
				silent: true
			});

			// reinsert at next position
			//
			this.collection.add(this.model, {
				at: index + 1,
				silent: true
			});

			this.options.parent.render();
			this.onChange();
		},

		onClickMoveUp: function() {
			var index = this.collection.indexOf(this.model);

			// remove from collection
			//
			this.collection.remove(this.model, {
				silent: true
			});

			// reinsert at prev position
			//
			this.collection.add(this.model, {
				at: index - 1, 
				silent: true
			});

			this.options.parent.render();
			this.onChange();
		},

		onClickDelete: function() {
			this.options.parent.collection.remove(this.model);
			this.onChange();
		},

		onChange: function() {
			if (this.options.onChange) {
				this.options.onChange();
			}
		}
	});
});