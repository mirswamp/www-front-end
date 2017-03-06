/******************************************************************************\
|                                                                              |
|                                 route-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of an API method or route.         |
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
	'validate',
	'popover',
	'text!templates/api/routes/forms/route-form.tpl',
	'registry',
	'collections/api/parameters',
	'views/api/routes/headers-list/headers-list-view',
	'views/api/routes/parameters-list/parameters-list-view',
	'views/api/routes/responses-list/responses-list-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Validate, Popover, Template, Registry, Parameters, HeadersListView, ParametersListView, ResponsesListView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			headersList: '#headers-list',
			queryParametersList: '#query-parameters-list',
			bodyParametersList: '#body-parameters-list',
			responsesList: '#responses-list'
		},

		events: {
			'change input, textarea, select': 'onChange'
		},

		//
		// saving methods
		//

		saveHeaders: function(done) {
			var self = this;
			this.options.headers.save({

				// callbacks
				//
				success: function() {
					self.removeHeaders(done);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save route headers."
						})
					);
				}
			});
		},

		saveParameters: function(done) {
			var self = this;

			// set parameter types
			//
			for (var i = 0; i < this.options.queryParameters.length; i++) {
				this.options.queryParameters.at(i).set({
					'kind': 'query'
				});
			}
			for (var i = 0; i < this.options.bodyParameters.length; i++) {
				this.options.bodyParameters.at(i).set({
					'kind': 'body'
				});
			}

			// concatenate parameters
			//
			var parameters = new Parameters();
			parameters.add(this.options.queryParameters.models);
			parameters.add(this.options.bodyParameters.models);

			parameters.save({

				// callbacks
				//
				success: function() {
					self.removeQueryParameters(function() {
						self.removeBodyParameters(function() {
							done();
						})
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save route parameters."
						})
					);
				}
			});
		},

		saveResponses: function(done) {
			var self = this;
			this.options.responses.save({

				// callbacks
				//
				success: function() {
					self.removeResponses(done);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save route responses."
						})
					);
				}
			});
		},

		saveItems: function(done) {
			var self = this;
			this.saveHeaders(function() {
				self.saveParameters(function() {
					self.saveResponses(function() {
						if (done) {
							done();
						}
					})
				})
			});
		},

		//
		// removing methods
		//

		removeHeaders: function(done) {
			var self = this;
			this.headersList.currentView.removedItems.destroy({

				// callbacks
				//
				success: function() {
					if (done) {
						done();
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not remove route headers."
						})
					);
				}
			});
		},

		removeQueryParameters: function(done) {
			var self = this;
			this.queryParametersList.currentView.removedItems.destroy({

				// callbacks
				//
				success: function() {
					if (done) {
						done();
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not remove route query parameters."
						})
					);
				}
			});
		},

		removeBodyParameters: function(done) {
			var self = this;
			this.bodyParametersList.currentView.removedItems.destroy({

				// callbacks
				//
				success: function() {
					if (done) {
						done();
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not remove route body parameters."
						})
					);
				}
			});
		},

		removeResponses: function(done) {
			var self = this;
			this.responsesList.currentView.removedItems.destroy({

				// callbacks
				//
				success: function() {
					if (done) {
						done();
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not remove route responses."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				showServer: this.options.showServer,
				showCategory: this.options.showCategory
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// show subviews
			//
			if (this.options.headers) {
				this.showHeaders(this.options.headers);
			}
			if (this.options.queryParameters) {
				this.showQueryParameters(this.options.queryParameters);
			}
			if (this.options.bodyParameters) {
				this.showBodyParameters(this.options.bodyParameters);
			}
			if (this.options.responses) {
				this.showResponses(this.options.responses);
			}

			// validate form
			//
			this.validator = this.validate();
		},

		showHeaders: function(headers) {
			var self = this;
			this.options.headers = headers;
			this.headersList.show(
				new HeadersListView({
					model: this.model,
					collection: headers,
					editable: true,
					showDelete: true,

					// callbacks
					//
					onChange: function() {
						self.onChange();
					}
				})
			);
		},

		showQueryParameters: function(parameters) {
			var self = this;
			this.options.queryParameters = parameters;
			this.queryParametersList.show(
				new ParametersListView({
					model: this.model,
					collection: parameters,
					editable: true,
					showDelete: true,

					// callbacks
					//
					onChange: function() {
						self.onChange();
					}
				})
			);
		},

		showBodyParameters: function(parameters) {
			var self = this;
			this.options.bodyParameters = parameters;
			this.bodyParametersList.show(
				new ParametersListView({
					model: this.model,
					collection: parameters,
					editable: true,
					showDelete: true,

					// callbacks
					//
					onChange: function() {
						self.onChange();
					}
				})
			);
		},

		showResponses: function(responses) {
			var self = this;
			this.options.responses = responses;
			this.responsesList.show(
				new ResponsesListView({
					model: this.model,
					collection: responses,
					editable: true,
					showDelete: true,

					// callbacks
					//
					onChange: function() {
						self.onChange();
					}
				})
			);
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate();
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// form methods
		//

		update: function(package) {

			// get values from form
			//
			var method = this.$el.find('#method').val();
			var route = this.$el.find('#route').val();
			var description = this.$el.find('#description').val();
			var category = this.$el.find('#category').val();
			var server = this.$el.find('#server').val();
			var private = this.$el.find('#private').is(':checked');

			// update model
			//
			this.model.set({
				'method': method,
				'route': route,
				'description': description != ''? description : null,
				'category': category != ''? category : null,
				'server': server,
				'private': private
			});
		},

		//
		// event handling methods
		//

		onChange: function() {
			if (this.options.onChange) {
				this.options.onChange();
			}
		},
	});
});