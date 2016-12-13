/******************************************************************************\
|                                                                              |
|                                public-packages-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for showing a list of public curated packages.         |
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
	'text!templates/packages/public-packages.tpl',
	'registry',
	'collections/packages/packages',
	'views/dialogs/error-view',
	'views/packages/filters/public-package-filters-view',
	'views/packages/list/packages-list-view'
], function($, _, Backbone, Marionette, Template, Registry, Packages, ErrorView, PublicPackageFiltersView, PackagesListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//
		
		template: _.template(Template),

		regions: {
			packageFilters: '#package-filters',
			packagesList: '#packages-list'
		},

		events: {
			'click #reset-filters': 'onClickResetFilters',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Packages();
		},

		//
		// querying methods
		//

		getQueryString: function() {
			return this.packageFilters.currentView.getQueryString();
		},

		getFilterData: function() {
			return this.packageFilters.currentView.getData();
		},

		//
		// ajax methods
		//

		fetchPackages: function(done) {
			var self = this;
			this.collection.fetchPublic({
				data: this.packageFilters.currentView? this.packageFilters.currentView.getAttrs() : null,

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get list of packages."
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
				loggedIn: Registry.application.session.user != null,
				showNumbering: Registry.application.options.showNumbering
			}));
		},

		onRender: function() {

			// show package filters view
			//
			this.showFilters();

			// show packages list
			//
			this.fetchAndShowList();
		},

		showFilters: function() {
			var self = this;

			// show package filters view
			//
			this.packageFilters.show(
				new PublicPackageFiltersView({
					model: this.model,
					data: this.options.data? this.options.data : {},

					// callbacks
					//
					onChange: function() {
						// setQueryString(self.packageFilters.currentView.getQueryString());				
					
						// update filter data
						//
						var projects = self.options.data.projects;
						self.options.data = self.getFilterData();
						self.options.data.projects = projects;

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

		fetchAndShowList: function() {
			var self = this;
			this.fetchPackages(function() {
				self.showList();
			});
		},

		showList: function() {

			// show list of packages
			//
			this.packagesList.show(
				new PackagesListView({
					collection: this.collection,
					showNumbering: Registry.application.options.showNumbering,
					showDelete: false
				})
			);
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update list
			//
			this.fetchAndShowList();
		},

		onClickResetFilters: function() {
			this.packageFilters.currentView.reset();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
