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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/public-packages.tpl',
	'collections/packages/packages',
	'views/base-view',
	'views/packages/filters/public-package-filters-view',
	'views/packages/list/packages-list-view'
], function($, _, Template, Packages, BaseView, PublicPackageFiltersView, PackagesListView) {
	return BaseView.extend({

		//
		// attributes
		//
		
		template: _.template(Template),

		regions: {
			filters: '#package-filters',
			list: '#packages-list'
		},

		events: {
			'click #reset-filters': 'onClickResetFilters',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Packages();
		},

		//
		// querying methods
		//

		getQueryString: function() {
			return this.getChildView('filters').getQueryString();
		},

		getFilterData: function() {
			return this.getChildView('filters').getData();
		},

		//
		// ajax methods
		//

		fetchPackages: function(done) {
			var self = this;
			this.collection.fetchPublic({
				data: this.getChildView('filters')? this.getChildView('filters').getAttrs() : null,

				// callbacks
				//
				success: function() {
					done(self.collection);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get list of packages."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				loggedIn: application.session.user != null,
				showNumbering: application.options.showNumbering
			};
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
			this.showChildView('filters', new PublicPackageFiltersView({
				model: this.model,
				data: this.options.data? this.options.data : {},

				// callbacks
				//
				onChange: function() {
				
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
			}));
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
			this.showChildView('list', new PackagesListView({
				collection: this.collection,
				showNumbering: application.options.showNumbering,
				showDelete: false
			}));
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
			this.getChildView('filters').reset();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
