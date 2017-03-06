/******************************************************************************\
|                                                                              |
|                                  route-view.js                               |
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
	'config',
	'registry',
	'popover',
	'text!templates/api/routes/route.tpl',
	'models/api/response',
	'collections/api/headers',
	'collections/api/parameters',
	'collections/api/responses',
	'views/api/routes/headers-list/headers-list-view',
	'views/api/routes/parameters-list/parameters-list-view',
	'views/api/routes/responses-list/responses-list-view',
	'views/dialogs/error-view',
	'views/dialogs/confirm-view'
], function($, _, Backbone, Marionette, Config, Registry, Popover, Template, Response, Headers, Parameters, Responses, HeadersListView, ParametersListView, ResponsesListView, ErrorView, ConfirmView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			headersList: '#headers-list',
			queryParametersList: '#query-parameters .parameters-list',
			bodyParametersList: '#body-parameters .parameters-list',
			responsesList: '#responses-list'
		},

		events: {
			'click #back': 'onClickBack',
			'click #try-me': 'onClickTryMe',
			'click #view-curl': 'onClickViewCurl',
			'click #edit': 'onClickEdit',
			'click #delete': 'onClickDelete'
		},

		//
		// methods
		//

		initialize: function() {

			// set optional parameter defaults
			//
			if (this.options.editable == undefined) {
				this.options.editable = Registry.application.session.user && Registry.application.session.user.isAdmin();
			}
			if (this.options.showServer == undefined) {
				this.options.showServer = false;
			}
			if (this.options.showCategory == undefined) {
				this.options.showCategory = true;
			}
			if (this.options.showPrivate == undefined) {
				this.options.showPrivate = Registry.application.session.user && Registry.application.session.user.isAdmin();
			}

			// set attributes
			//
			this.headers = new Headers();
			this.parameters = new Parameters();
			this.responses = new Responses();
			this.defaultResponse = new Response({
				status_code: 200,
				type: 'none',
				description: 'No errors.'
			});
		},

		//
		// ajax methods
		//

		fetchHeaders: function(done) {
			var self = this;
			this.headers.fetchByRoute(this.model, {

				// callbacks
				//
				success: function() {
					done(self.headers);
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
					done(self.parameters);
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
					if (self.responses.length == 0 && self.defaultResponse) {
						self.responses.add(self.defaultResponse);
					}
					done(self.responses);
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				editable: this.options.editable,
				showServer: this.options.showServer,
				showPrivate: this.options.showPrivate,
				showCategory: this.options.showCategory,
				serverHost: Config.servers[this.model.get('data.server')]
			}));
		},

		showHeaders: function(headers) {
			if (headers.length > 0) {
				this.$el.find("#headers").show();

				// show list of headers
				//
				this.headersList.show(
					new HeadersListView({
						collection: headers,
						showDelete: false
					})
				);
			}
		},

		showQueryParameters: function(parameters) {
			if (parameters.length > 0) {
				this.$el.find("#query-parameters").show();

				// show list of parameters
				//
				this.queryParametersList.show(
					new ParametersListView({
						model: this.model,
						collection: parameters,
						editable: false,
						showDelete: false
					})
				);
			}
		},

		showBodyParameters: function(parameters) {
			if (parameters.length > 0) {
				this.$el.find("#body-parameters").show();

				// show list of parameters
				//
				this.bodyParametersList.show(
					new ParametersListView({
						model: this.model,
						collection: parameters,
						editable: false,
						showDelete: false
					})
				);
			}
		},

		showResponses: function(responses) {
			if (this.responses.length > 0) {
				this.$el.find("#responses").show();

				// show list of responses
				//
				this.responsesList.show(
					new ResponsesListView({
						model: this.model,
						collection: this.responses,
						showDelete: false
					})
				);
			}
		},

		fetchAndShowHeaders: function() {
			var self = this;
			this.fetchHeaders(function(headers) {
				self.showHeaders(headers);
			});
		},

		fetchAndShowParameters: function() {
			var self = this;
			this.fetchParameters(function(parameters) {

				// separate parameters
				//
				var queryParameters = new Parameters(parameters.filter(function(item) {
					return item.get('kind') == 'query';
				}));
				var bodyParameters = new Parameters(parameters.filter(function(item) {
					return item.get('kind') == 'body';
				}));

				// show parameters
				//
				self.showQueryParameters(queryParameters);
				self.showBodyParameters(bodyParameters);
			});
		},

		fetchAndShowResponses: function() {
			var self = this;
			this.fetchResponses(function(responses) {
				self.showResponses(responses);
			});
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// show subviews
			//
			this.fetchAndShowHeaders();
			this.fetchAndShowParameters();
			this.fetchAndShowResponses();
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

		onClickTryMe: function() {
			var self = this;
			require([
				'registry',
				'views/api/dialogs/rest-client/rest-client-view'
			], function (Registry, RestClientView) {

				// get body parameters
				//
				var bodyParameters = new Parameters(self.parameters.filter(function(item) {
					return item.get('kind') == 'body';
				}));

				// show rest client dialog
				//
				Registry.application.modal.show(
					new RestClientView({
						model: self.model,
						headers: self.headers.getKeyValueArray(),
						parameters: bodyParameters.getKeyValueArray()
					}), {
						size: 'large'
					}
				);
			});
		},
		
		onClickEdit: function() {

			// go to edit view
			//
			Backbone.history.navigate('#api/routes/' + this.model.get('route_uuid') + '/edit', {
				trigger: true
			});
		},

		onClickDelete: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Route",
					message: "Are you sure that you want to delete this route?",

					// callbacks
					//
					accept: function() {

						// delete route
						//
						self.model.destroy({

							// callbacks
							//
							success: function() {

								// return to api view
								//
								Backbone.history.navigate('#api', {
									trigger: true
								});
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this route."
									})
								);
							}
						});
					}
				})
			);
		}
	});
});
