/******************************************************************************\
|                                                                              |
|                               responses-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of api route responses.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'popover',
	'registry',
	'text!templates/api/routes/responses-list/responses-list.tpl',
	'models/api/response',
	'collections/api/responses',
	'views/widgets/lists/table-list-view',
	'views/api/routes/responses-list/responses-list-item-view'
], function($, _, Backbone, Marionette, Popover, Registry, Template, Response, Responses, TableListView, ResponsesListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: ResponsesListItemView,

		events: {
			'click #add-new-response': 'onClickAddNewResponse',
		},

		//
		// constructor
		//

		initialize: function() {

			// create remove list
			//
			this.removedItems = new Responses();

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

		onClickAddNewResponse: function() {
			this.collection.add(
				new Response({
					route_uuid: this.model.get('route_uuid'),
					status_code: 200,
					type: '',
					description: '',
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
