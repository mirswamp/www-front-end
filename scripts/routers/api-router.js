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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {

	//
	// query string methods
	//

	function fetchRouteByMethod(method, name, options) {
		var self = this;
		require([
			'collections/api/routes'
		], function (Routes) {
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
		});
	}

	function fetchActualRouteByMethod(method, name, servers, options) {
		var self = this;
		require([
			'config',
			'collections/api/routes'
		], function (Config, Routes) {
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
			'api/routes/:route_uuid/edit': 'showEditApiRoute',
			'api/routes/:method/*route': 'showApiMethodRoute',
			'api/types/add': 'showAddNewType',
			'api/types/:type': 'showApiType',
			'api/types/:type_uuid/edit': 'showEditApiType'
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
		},

		showAddNewType: function() {
			require([
				'registry',
				'views/api/types/add/add-new-type-view'
			], function (Registry, AddNewTypeView) {

				// show main view
				//
				Registry.application.showMain(
					new AddNewTypeView()
				);
			});
		},

		showApiType: function(name) {
			var self = this;
			require([
				'registry',
				'models/api/type',
				'views/api/types/type-view',
				'views/dialogs/notify-view',
			], function (Registry, Type, TypeView, NotifyView) {

				// fetch route by name
				//
				new Type().fetchByName(name, {

					// callbacks
					//
					success: function(model) {

						// show main view
						//
						if (model) {
							Registry.application.showMain(
								new TypeView({
									model: model
								})
							);
						}
					},

					error: function(message) {
						Registry.application.modal.show(
							new NotifyView({
								message: "Could not find specified API data type: " + dataType
							})
						);
					}
				});	
			});	
		},

		showEditApiType: function(typeUuid) {
			var self = this;
			require([
				'registry',
				'models/api/type',
				'views/api/types/edit/edit-type-view',
				'views/dialogs/notify-view',
			], function (Registry, Type, EditTypeView, NotifyView) {

				// fetch route
				//
				new Type({
					'type_uuid': typeUuid
				}).fetch({

					// callbacks
					//
					success: function(model) {

						// show main view
						//
						Registry.application.showMain(
							new EditTypeView({
								model: model
							})
						);
					},

					error: function(message) {
						Registry.application.modal.show(
							new NotifyView({
								message: "Could not find specified API type."
							})
						);
					}
				});
			});
		}
	});
});