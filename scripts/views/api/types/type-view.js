/******************************************************************************\
|                                                                              |
|                                  type-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an API documentation view of the application.            |
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
	'registry',
	'text!templates/api/types/type.tpl',
	'collections/api/fields',
	'views/api/types/fields-list/fields-list-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Registry, Template, Fields, FieldsListView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			fieldsList: '#fields-list'
		},

		events: {
			'click #back': 'onClickBack'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Fields();
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				editable: this.options.editable
			}));
		},

		onRender: function() {
			this.fetchAndShowFields();
		},

		showFields: function() {

			// show list of fields
			//
			this.fieldsList.show(
				new FieldsListView({
					collection: this.collection,
					showDelete: false
				})
			);
		},

		fetchAndShowFields: function() {
			var self = this;
			this.collection.fetchByType(this.model, {

				// callbacks
				//
				success: function() {
					self.showFields();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch fields."
						})
					);
				}
			})
		},

		//
		// event handling methods
		//

		onClickBack: function() {

			// return to api view
			//
			Backbone.history.navigate('#api', {
				trigger: true
			});
		},
	});
});
