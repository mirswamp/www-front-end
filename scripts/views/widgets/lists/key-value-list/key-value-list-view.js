/******************************************************************************\
|                                                                              |
|                                key-value-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of key value pairs.             |
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
	'popover',
	'registry',
	'text!templates/widgets/lists/key-value-list/key-value-list.tpl',
	'views/widgets/lists/table-list-view',
	'views/widgets/lists/key-value-list/key-value-list-item-view'
], function($, _, Backbone, Marionette, Popover, Registry, Template, TableListView, KeyValueListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: KeyValueListItemView,

		events: {
			'click #add-new-pair': 'onClickAddNewPair',
		},

		//
		// constructor
		//

		initialize: function() {

			// create collection from key value pairs
			//
			this.collection = new Backbone.Collection();
			if (this.options.array) {
				for (var key in this.options.array) {
					this.collection.add(new Backbone.Model({
						key: key,
						value: this.options.array[key]
					}));
				}
			}

			// call superclass method
			//
			TableListView.prototype.initialize.call(this);
		},

		//
		// querying methods
		//

		toData: function() {
			var object = new Object;
			for (var i = 0; i < this.collection.length; i++) {
				var model = this.collection.at(i);
				var key = model.get('key');
				var value = model.get('value');
				object[key] = value;
			}
			return object;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				editable: this.options.editable,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function(model, index) {
			return {
				model: model,
				index: index,
				collection: this.collection,
				editable: this.options.editable,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete,
				parent: this
			}
		},
		
		onRender: function() {

			// call superclass method
			//
			TableListView.prototype.onRender.call(this);

			// clear popovers
			//
			$(".popover").remove();

			// show tooltips
			//
			this.$el.find("[data-toggle='tooltip']").popover({
				trigger: 'hover'
			});
		},

		//
		// event handling methods
		//

		onClickAddNewPair: function() {
			this.collection.add(
				new Backbone.Model({
					key: 'untitled',
					value: undefined
				})
			);

			// re-render list
			//
			this.render();
		},
	});
});
