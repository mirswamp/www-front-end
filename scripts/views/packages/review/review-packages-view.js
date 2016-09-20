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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/review/review-packages.tpl',
	'registry',
	'utilities/query-strings',
	'utilities/url-strings',
	'collections/packages/packages',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/packages/filters/review-packages-filters-view',
	'views/packages/review/review-packages-list/review-packages-list-view'
], function($, _, Backbone, Marionette, Template, Registry, QueryStrings, UrlStrings, Projects, NotifyView, ErrorView, ReviewPackagesFiltersView, ReviewPackagesListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageFilters: '#package-filters',
			reviewPackagesList: '#review-packages-list'
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
			this.collection = new Projects();
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

			// fetch packages
			//
			this.collection.fetchAll({
				data: this.packageFilters.currentView? this.packageFilters.currentView.getAttrs() : null,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not load packages."
						})
					);
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
					Registry.application.modal.show(
						new NotifyView({
							title: "Package Changes Saved",
							message: "Your package changes have been successfully saved."
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Your package changes could not be saved."
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
				data: this.options.data,
				showNumbering: Registry.application.getShowNumbering()
			}));
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
			this.packageFilters.show(
				new ReviewPackagesFiltersView({
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

		showList: function() {

			// show review packages list view
			//
			this.reviewPackagesList.show(
				new ReviewPackagesListView({
					collection: this.collection,
					showDeactivatedPackages: this.$el.find('#show-deactivated-packages').is(':checked'),
					showNumbering: Registry.application.getShowNumbering(),
					showDelete: true
				})
			);
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
			this.reviewPackagesList.currentView.options.showDeactivatedPackages = this.$el.find('#show-deactivated-packages').is(':checked');
			this.reviewPackagesList.currentView.render();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
