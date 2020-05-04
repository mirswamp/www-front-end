/******************************************************************************\
|                                                                              |
|                            key-value-list-view.js                            |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/popover',
	'text!templates/collections/lists/key-value-list/key-value-list.tpl',
	'views/collections/tables/table-list-view',
	'views/collections/lists/key-value-list/key-value-list-item-view'
], function($, _, Popover, Template, TableListView, KeyValueListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
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
			var data = [];

			for (var i = 0; i < this.collection.length; i++) {
				var model = this.collection.at(i);
				var key = model.get('key');
				var value = model.get('value');
				data[key] = value;
			}

			return data;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				editable: this.options.editable,
				showDelete: this.options.showDelete
			};
		},

		childViewOptions: function(model) {

			// check if empty view
			//
			if (!model) {
				return {};
			}

			// return view options
			//
			return {
				model: model,
				index: this.collection.indexOf(model),
				collection: this.collection,
				editable: this.options.editable,
				showDelete: this.options.showDelete,
				parent: this
			};
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
