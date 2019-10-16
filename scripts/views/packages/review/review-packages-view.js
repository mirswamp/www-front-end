/******************************************************************************\
|                                                                              |
|                             review-packages-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for reviewing, accepting, or declining            |
|        package approval.                                                     |
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
	'text!templates/packages/review/review-packages.tpl',
	'collections/packages/packages',
	'views/base-view',
	'views/packages/filters/review-packages-filters-view',
	'views/packages/review/review-packages-list/review-packages-list-view',
	'utilities/web/query-strings',
	'utilities/web/url-strings'
], function($, _, Template, Packages, BaseView, ReviewPackagesFiltersView, ReviewPackagesListView, QueryStrings, UrlStrings) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			filters: '#package-filters',
			list: '#review-packages-list'
		},

		events: {
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel',
			'click #show-deactivated-packages': 'onClickShowDeactivatedPackages',
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

			// fetch packages
			//
			this.collection.fetchAll({
				data: this.getChildView('filters')? this.getChildView('filters').getAttrs() : null,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not load packages."
					});
				}
			});
		},

		savePackages: function() {
			this.collection.save({

				// callbacks
				//
				success: function() {

					// show success notify view
					//
					application.notify({
						title: "Package Changes Saved",
						message: "Your package changes have been successfully saved."
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Your package changes could not be saved."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				data: this.options.data,
				showNumbering: application.options.showNumbering
			};
		},

		onRender: function() {

			// show package filters
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
			this.showChildView('filters', new ReviewPackagesFiltersView({
				model: this.model,
				data: this.options.data? this.options.data : {},

				// callbacks
				//
				onChange: function() {
					// setQueryString(self.getChildView('filters').getQueryString());			
				
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

		showList: function() {

			// show review packages list view
			//
			this.showChildView('list', new ReviewPackagesListView({
				collection: this.collection,
				showDeactivatedPackages: this.$el.find('#show-deactivated-packages').is(':checked'),
				showNumbering: application.options.showNumbering,
				showDelete: true
			}));
		},

		fetchAndShowList: function() {
			var self = this;
			this.fetchPackages(function() {
				self.showList();
			});
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update list
			//
			this.fetchAndShowList();
		},

		onClickSave: function() {

			// disable save button
			//
			this.$el.find('#save').prop('disabled', true);

			// save packages
			//
			this.savePackages();
		},

		onClickCancel: function() {

			// return to overview
			//
			Backbone.history.navigate('#overview', {
				trigger: true
			});
		},

		onClickShowDeactivatedPackages: function() {
			this.getChildView('list').options.showDeactivatedPackages = this.$el.find('#show-deactivated-packages').is(':checked');
			this.getChildView('list').render();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
