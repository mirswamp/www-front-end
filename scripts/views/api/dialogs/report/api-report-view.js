/******************************************************************************\
|                                                                              |
|                                api-report-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that shows a report of the current api.     |
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
	'tab',
	'popover',
	'config',
	'registry',
	'text!templates/api/dialogs/report/api-report.tpl',
	'collections/api/routes',
	'views/api/routes-list/routes-list-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Tab, Popover, Config, Registry, Template, Routes, RoutesListView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			actualRoutesList: '#actual-routes-list',
			undocumentedRoutesList: '#undocumented-routes-list',
			obsoleteDocumentedRoutesList: '#obsolete-documented-routes-list'
		},

		events: {
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {

			// create collections
			//
			this.actualRoutes = new Routes();
			this.documentedRoutes = new Routes();
			this.undocumentedRoutes = new Routes();
			this.obsoleteDocumentedRoutes = new Routes();
		},

		fetchRoutes: function(done) {
			var self = this;

			// fetch rws routes
			//
			this.actualRoutes.fetchActual(Config.servers['rws'] + '/routes', 'rws', {

				// callbacks
				//
				success: function() {
					var routes = new Routes();

					// fetch csa routes
					//
					routes.fetchActual(Config.servers['csa'] + '/routes', 'csa', {

						// callbacks
						//
						success: function() {
							self.actualRoutes.add(routes.models);

							// perform callback
							//
							done();
						}
					});
				}
			});
		},

		findUndocumentedRoutes: function() {
			for (var i = 0; i < this.actualRoutes.length; i++) {
				var model = this.actualRoutes.at(i);
				var method = model.get('method');
				var route = model.get('route');
				if (!this.documentedRoutes.getRoute(method, route)) {
					this.undocumentedRoutes.add(model);
				}
			}
		},

		findObsoleteDocumentedRoutes: function() {
			for (var i = 0; i < this.documentedRoutes.length; i++) {
				var model = this.documentedRoutes.at(i);
				var method = model.get('method');
				var route = model.get('route');
				if (!this.actualRoutes.getRoute(method, route)) {
					this.obsoleteDocumentedRoutes.add(model);
				}
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				showNumbering: Registry.application.options.showNumbering
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// fetch and show routes
			//
			var self = this;
			this.fetchRoutes(function() {
				self.showActualRoutes();

				self.documentedRoutes.fetch({

					// callbacks
					//
					success: function() {
						self.findUndocumentedRoutes();
						self.showUndocumentedRoutes();
						self.findObsoleteDocumentedRoutes();
						self.showObsoleteDocumentedRoutes();
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch documented API routes."
							})
						);
					}
				});
			});
		},

		showLists: function() {
			this.showActualRoutes();
			this.showUndocumentedRoutes();
			this.showObsoleteDocumentedRoutes();
		},

		showActualRoutes: function() {
			this.actualRoutesList.show(
				new RoutesListView({
					collection: this.actualRoutes,
					showNumbering: Registry.application.options.showNumbering
				})
			);
		},

		showUndocumentedRoutes: function() {
			this.undocumentedRoutesList.show(
				new RoutesListView({
					collection: this.undocumentedRoutes,
					showNumbering: Registry.application.options.showNumbering
				})
			);
		},

		showObsoleteDocumentedRoutes: function() {
			this.obsoleteDocumentedRoutesList.show(
				new RoutesListView({
					collection: this.obsoleteDocumentedRoutes,
					showNumbering: Registry.application.options.showNumbering
				})
			);
		},

		//
		// event handling methods
		//

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showLists();
		},

		onBeforeDestroy: function() {
			
			// dismiss modal dialog
			//
			Registry.application.modal.hide();
		}
	});
});
