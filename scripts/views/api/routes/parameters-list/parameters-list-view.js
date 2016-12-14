/******************************************************************************\
|                                                                              |
|                               parameters-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of api route parameters.        |
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
	'text!templates/api/routes/parameters-list/parameters-list.tpl',
	'models/api/parameter',
	'collections/api/parameters',
	'views/widgets/lists/table-list-view',
	'views/api/routes/parameters-list/parameters-list-item-view'
], function($, _, Backbone, Marionette, Popover, Registry, Template, Parameter, Parameters, TableListView, ParametersListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: ParametersListItemView,

		events: {
			'click #add-new-parameter': 'onClickAddNewParameter',
		},

		//
		// constructor
		//

		initialize: function() {

			// create remove list
			//
			this.removedItems = new Parameters();

			// call superclass method
			//
			TableListView.prototype.initialize.call(this);
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				editable: this.options.editable,
				showOrder: this.options.showOrder,
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
				showOrder: this.options.showOrder,
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

		onClickAddNewParameter: function() {
			this.collection.add(
				new Parameter({
					route_uuid: this.model.get('route_uuid'),
					name: 'untitled',
					type: '',
					description: '',
					optional: false,
					order: this.collection.length + 1
				})
			);

			// re-render list
			//
			this.render();
		},

		onChange: function() {
			if (this.options.onChange) {
				this.options.onChange();
			}
		}
	});
});
