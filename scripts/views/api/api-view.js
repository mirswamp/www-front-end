/******************************************************************************\
|                                                                              |
|                                    api-view.js                               |
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
	'text!templates/api/api.tpl',
	'collections/api/routes',
	'collections/api/types',
	'views/api/routes/filters/route-filters-view',
	'views/api/routes-list/routes-list-view',
	'views/api/types-list/types-list-view',
	'views/api/dialogs/report/api-report-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Config, Registry, Template, Routes, Types, RouteFiltersView, RoutesListView, TypesListView, APIReportView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			routeFilters: '#route-filters',
			routesList: '#routes-list',
			typesList: '#types-list'
		},

		events: {
			'click #add-new-route': 'onClickAddNewRoute',
			'click #show-numbering': 'onClickShowNumbering',
			'click #view-report': 'onClickViewReport'
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
				this.options.showCategory = false;
			}
			if (this.options.showUnfinished == undefined) {
				this.options.showUnfinished = Registry.application.session.user && Registry.application.session.user.isAdmin();
			}
			if (this.options.showPrivate == undefined) {
				this.options.showPrivate = Registry.application.session.user && Registry.application.session.user.isAdmin();
			}

			// set attributes
			//
			this.collection = new Routes();
			this.types = new Types();
		},

		//
		// querying methods
		//

		getQueryString: function() {
			return this.routeFilters.currentView.getQueryString();
		},

		getFilterData: function() {
			return this.routeFilters.currentView.getData();
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				Config: Config,
				editable: this.options.editable,
				showPrivate: this.options.showPrivate,
				showNumbering: Registry.application.options.showNumbering
			}));
		},

		onRender: function() {

			// show route filters
			//
			this.showFilters();

			// show lists
			//
			this.fetchAndShowRoutesList();
			this.fetchAndShowTypesList();
		},

		showFilters: function() {
			var self = this;
			
			// show package filters view
			//
			this.routeFilters.show(
				new RouteFiltersView({
					data: this.options.data? this.options.data : {},

					// callbacks
					//
					onChange: function() {
						//setQueryString(self.packageFilters.currentView.getQueryString());			
					
						// update filter data
						//
						self.options.data = self.getFilterData();

						// update url
						//
						var queryString = self.getQueryString();
						var state = window.history.state;
						var url = getWindowBaseLocation() + (queryString? ('?' + queryString) : '');
						window.history.pushState(state, '', url);

						// update view
						//
						self.onChange();
					}
				})
			);
		},

		fetchAndShowRoutesList: function() {
			var self = this;
			this.collection.reset();
			this.collection.fetch({
				data: this.getFilterData(),

				// callbacks
				//
				success: function() {
					self.showRoutesList();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch list of API routes."
						})
					);			
				}
			});
		},

		showRoutesList: function() {
			this.routesList.show(
				new RoutesListView({
					collection: this.collection,
					editable: false,
					showServer: this.options.showServer,
					showCategory: this.options.showCategory,
					showUnfinished: this.options.showUnfinished,
					showPrivate: this.options.showPrivate,
					showNumbering: Registry.application.options.showNumbering
				})
			)
		},

		fetchAndShowTypesList: function() {
			var self = this;
			this.types.reset();
			this.types.fetch({

				// callbacks
				//
				success: function() {
					self.showTypesList();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch list of API data types."
						})
					);			
				}
			});
		},

		showTypesList: function() {
			this.typesList.show(
				new TypesListView({
					collection: this.types,
					editable: false,
					showUnfinished: this.options.showUnfinished,
					showPrivate: this.options.showPrivate,
					showNumbering: Registry.application.options.showNumbering
				})
			)
		},

		//
		// event handling methods
		//

		onChange: function() {
			this.fetchAndShowList();
		},

		onClickAddNewRoute: function() {

			// go to add new route view
			//
			Backbone.history.navigate('#api/routes/add', {
				trigger: true
			});
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showRoutesList();
			this.showTypesList();
		},

		onClickViewReport: function() {

			// show API report dialog
			//
			Registry.application.modal.show(
				new APIReportView(), {
					size: 'large'
				}
			);			
		}
	});
});
