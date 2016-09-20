/******************************************************************************\
|                                                                              |
|                                  edit-route-view.js                          |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'registry',
	'text!templates/api/routes/edit/edit-route.tpl',
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
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {
			this.headers = new Headers();
			this.parameters = new Parameters();
			this.responses = new Responses();
		},

		//
		// fetching methods
		//

		fetchHeaders: function(done) {
			var self = this;
			this.headers.fetchByRoute(this.model, {

				// callbacks
				//
				success: function() {
					if (done) {
						done(self.headers);
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch list of API route headers."
						})
					);			
				}
			});
		},

		fetchParameters: function(done) {
			var self = this;
			this.parameters.fetchByRoute(this.model, {

				// callbacks
				//
				success: function() {
					if (done) {
						done(self.parameters);
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch list of API route parameters."
						})
					);			
				}
			});
		},

		fetchResponses: function(done) {
			var self = this;
			this.responses.fetchByRoute(this.model, {

				// callbacks
				//
				success: function() {
					if (done) {
						done(self.responses);
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch list of API route responses."
						})
					);			
				}
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// show form view
			//
			this.form.show(
				new RouteFormView({
					model: this.model,
					showServer: false,
					showCategory: true,

					onChange: function() {

						// enable save button
						//
						self.$el.find('#save').prop('disabled', false);	
					}
				})
			);

			// show subviews
			//
			this.fetchHeaders(function(headers) {
				self.form.currentView.showHeaders(headers);
			});
			this.fetchParameters(function(parameters) {

				// separate parameters
				//
				var queryParameters = new Parameters(parameters.filter(function(item) {
					return item.get('kind') == 'query';
				}));
				var bodyParameters = new Parameters(parameters.filter(function(item) {
					return item.get('kind') == 'body';
				}));

				self.form.currentView.showQueryParameters(queryParameters);
				self.form.currentView.showBodyParameters(bodyParameters);
			});
			this.fetchResponses(function(responses) {
				self.form.currentView.showResponses(responses);
			});
		},

		//
		// event handling methods
		//

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

			// return to route view
			//
			//Backbone.history.navigate('#api/routes/' + this.model.get('route_uuid'), {
			Backbone.history.navigate('#api/routes/' + this.model.get('method').toLowerCase() + '/' + this.model.get('route'), {
				trigger: true
			});
		}
	});
});
