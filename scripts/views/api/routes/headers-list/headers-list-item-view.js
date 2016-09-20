/******************************************************************************\
|                                                                              |
|                             headers-list-item-view.js                        |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'registry',
	'text!templates/api/routes/headers-list/headers-list-item.tpl'
], function($, _, Backbone, Marionette, Registry, Template) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'input .name': 'onInputName',
			'input .type': 'onInputType',
			'input .description': 'onInputDescription',
			'click input.optional': 'onClickOptional',
			'click button.move-down': 'onClickMoveDown',
			'click button.move-up': 'onClickMoveUp',
			'click button.delete': 'onClickDelete'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				index: this.options.index,
				num: this.collection.length,
				editable: this.options.editable,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}));
		},

		//
		// event handling methods
		//

		onInputName: function() {

			// update model
			//
			this.model.set({
				name: this.$el.find('.name.code').html().trim()
			});

			this.onChange();
		},

		onInputType: function() {

			// update model
			//
			this.model.set({
				type: this.$el.find('.type.code').html().trim()
			});

			this.onChange();
		},

		onInputDescription: function() {

			// update model
			//
			this.model.set({
				description: this.$el.find('.description').html().trim()
			});

			this.onChange();
		},

		onClickOptional: function() {

			// update model
			//
			this.model.set({
				optional: this.$el.find('input.optional').is(':checked')? 1 : 0
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

			this.collection.reorder();
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

			this.collection.reorder();
			this.options.parent.render();
			this.onChange();
		},

		onChange: function() {
			this.options.parent.options.onChange();
		},

		onClickDelete: function() {
			this.options.parent.removedItems.add(this.model);
			this.options.parent.collection.remove(this.model);
			this.onChange();
		}
	});
});