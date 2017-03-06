/******************************************************************************\
|                                                                              |
|                               add-new-route-view.js                          |
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
	'text!templates/api/routes/add/add-new-route.tpl',
	'models/api/route',
	'collections/api/headers',
	'collections/api/parameters',
	'collections/api/responses',
	'views/api/routes/forms/route-form-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Registry, Template, Route, Headers, Parameters, Responses, RouteFormView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#route-form'
		},

		events: {
			'change input, textarea, select': 'onChangeInput',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {

			// create new model
			//
			this.model = new Route({
				method: 'post',
				server: 'rws',
				private: false
			});

			// create sublists
			//
			this.headers = new Headers();
			this.parameters = new Parameters();
			this.responses = new Responses();
		},

		//
		// rendering methods
		//

		onRender: function() {
			this.form.show(
				new RouteFormView({
					model: this.model, 
					headers: this.headers,
					parameters: this.parameters,
					responses: this.responses,
					showServer: false,
					showCategory: true
				})
			);
		},

		//
		// event handling methods
		//

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);	
		},

		onClickSave: function() {
			var self = this;
			
			// check validation
			//
			if (this.form.currentView.isValid()) {

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);

				// update model
				//
				this.form.currentView.update(this.model);

				// perform save
				//
				this.model.save(null, {

					// callbacks
					//
					success: function() {

						// set route uuids
						//
						self.headers.setRoute(self.model);
						self.parameters.setRoute(self.model);
						self.responses.setRoute(self.model);

						// save lists
						//
						self.form.currentView.saveItems(function() {

							// return to route view
							//
							Backbone.history.navigate('#api/routes/' + self.model.get('route_uuid'), {
								trigger: true
							});
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not save route."
							})
						);
					}
				});
			}
		},

		onClickCancel: function() {

			// return to API view
			//
			Backbone.history.navigate('#api', {
				trigger: true
			});
		}
	});
});
