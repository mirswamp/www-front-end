/******************************************************************************\
|                                                                              |
|                                   api-router.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for this application.        |
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
	'config',
	'models/projects/project',
	'collections/api/routes',
	'collections/projects/projects'
], function($, _, Backbone, Config, Project, Routes, Projects) {

	//
	// query string methods
	//

	function fetchRouteByMethod(method, name, options) {
		var collection = new Routes();
		collection.fetch({

			// callbacks
			//
			success: function() {
				var model = collection.getRoute(method, name);
				if (model) {
					if (options && options.success) {
						options.success(model);
					}
				} else {
					if (options && options.error) {
						options.error();
					}
				}
			},

			error: function() {
				if (options && options.error) {
					options.error();
				}
			}
		});	
	}

	function fetchActualRouteByMethod(method, name, servers, options) {
		var collection = new Routes();
		collection.fetchActual(Config.servers['rws'] + '/routes', servers[0], {

			// callbacks
			//
			success: function() {

				// check for route in returned collection
				//
				var route = collection.getRoute(method, name);
				if (route) {
					options.success(route);
				} else {

					// look in other servers
					//
					if (servers.length > 1) {
						fetchActualRouteByMethod(method, name, servers.slice(1), options);
					} else {
						options.success(null);
					}
				}
			},

			error: function() {
				if (options && options.error) {
					options.error();
				}
			}
		});
	}

	// create router
	//
	return Backbone.Router.extend({

		//
		// route definitions
		//

		routes: {
		
			// api documentation routes
			//
			'api(?*query_string)': 'showApi',
			'api/routes/add': 'showAddNewApiRoute',
			'api/routes/:route': 'showApiRoute',
			'api/routes/:route/edit': 'showEditApiRoute',
			'api/routes/:method/*route': 'showApiMethodRoute'
		},

		//
		// api route handlers
		//

		showApi: function(queryString) {
			require([
				'registry',
				'views/api/api-view'
			], function (Registry, ApiView) {

				// show content view
				//
				/*
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'api', 

					// callbacks
					//
					done: function(view) {

						// show api view
						//
						view.content.show(
							new ApiView()
						);

						if (options && options.done) {
							options.done();
						}
					}
				});
				*/

				// show main view
				//
				Registry.application.showMain(
					new ApiView({
						data: queryStringToData(queryString)
					})
				);
			});
		},

		showAddNewApiRoute: function() {
			require([
				'registry',
				'views/api/routes/add/add-new-route-view'
			], function (Registry, AddNewRouteView) {

				// show content view
				//
				/*
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'api', 

					// callbacks
					//
					done: function(view) {

						// show add new route view
						//
						view.content.show(
							new AddNewRouteView()
						);

						if (options && options.done) {
							options.done();
						}
					}
				});
				*/

				// show main view
				//
				Registry.application.showMain(
					new AddNewRouteView()
				);
			});
		},

		showEditApiRoute: function(routeUuid, options) {
			var self = this;
			require([
				'registry',
				'models/api/route',
				'views/api/routes/edit/edit-route-view',
				'views/dialogs/notify-view',
			], function (Registry, Route, EditRouteView, NotifyView) {

				// fetch route
				//
				var route = new Route({
					'route_uuid': routeUuid
				});

				route.fetch({

					// callbacks
					//
					success: function(data) {

						// show content view
						//
						/*
						Registry.application.showContent({
							nav1: 'home',
							nav2: 'api', 

							// callbacks
							//
							done: function(view) {

								// show edit api route view
								//
								view.content.show(
									new EditRouteView({
										model: route
									})
								);

								if (options && options.done) {
									options.done();
								}
							}
						});

						*/
						// show main view
						//
						Registry.application.showMain(
							new EditRouteView({
								model: route
							})
						);
					},

					error: function(message) {
						Registry.application.modal.show(
							new NotifyView({
								message: "Could not find specified API route."
							})
						);
					}
				});
			});
		},

		showApiRoute: function(routeUuid, options) {
			var self = this;
			require([
				'registry',
				'models/api/route',
				'views/api/routes/route-view',
				'views/dialogs/notify-view',
			], function (Registry, Route, RouteView, NotifyView) {
					
				var route = new Route({
					'route_uuid': routeUuid
				});

				// fetch route by uuid
				//
				route.fetch({

					// callbacks
					//
					success: function(data) {

						// show content view
						//
						/*
						Registry.application.showContent({
							nav1: 'home',
							nav2: 'api', 

							// callbacks
							//
							done: function(view) {

								// show api route view
								//
								view.content.show(
									new RouteView({
										model: route
									})
								);

								if (options && options.done) {
									options.done();
								}
							}
						});
						*/

						// show main view
						//
						Registry.application.showMain(
							new RouteView({
								model: route
							})
						);
					},

					error: function(message) {
						Registry.application.modal.show(
							new NotifyView({
								message: "Could not find specified API route."
							})
						);
					}
				});
			});
		},

		showApiMethodRoute: function(method, route) {
			var self = this;
			require([
				'registry',
				'models/api/route',
				'views/api/routes/route-view',
				'views/dialogs/notify-view',
			], function (Registry, Route, RouteView, NotifyView) {

				// fetch route by uuid
				//
				fetchRouteByMethod(method, route, {

					// callbacks
					//
					success: function(model) {

						// show main view
						//
						if (model) {
							Registry.application.showMain(
								new RouteView({
									model: model
								})
							);
						}
					},

					error: function(message) {
						Registry.application.modal.show(
							new NotifyView({
								message: "Could not find specified API route: " + method + ' ' + route
							})
						);
					}
				});	
			});	
		}
	});
});