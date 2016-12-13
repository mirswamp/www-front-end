/******************************************************************************\
|                                                                              |
|                               review-tools-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for reviewing, accepting, or declining            |
|        tool approval.                                                        |
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
	'text!templates/tools/review/review-tools.tpl',
	'registry',
	'utilities/browser/query-strings',
	'utilities/browser/url-strings',
	'collections/tools/tools',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/tools/filters/tool-filters-view',
	'views/tools/review/review-tools-list/review-tools-list-view'
], function($, _, Backbone, Marionette, Template, Registry, QueryStrings, UrlStrings, Tools, NotifyView, ErrorView, ToolFiltersView, ReviewToolsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			toolFilters: '#tool-filters',
			reviewToolsList: '#review-tools-list'
		},

		events: {
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel',
			'click #show-deactivated-tools': 'onClickShowDeactivatedTools',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Tools();
		},

		//
		// querying methods
		//

		getQueryString: function() {
			return this.toolFilters.currentView.getQueryString();
		},

		getFilterData: function() {
			return this.toolFilters.currentView.getData();
		},

		//
		// ajax methods
		//

		fetchTools: function(done) {
			var self = this;

			// fetch tools
			//
			this.collection.fetchAll({
				data: this.toolFilters.currentView? this.toolFilters.currentView.getAttrs() : null,

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
							message: "Could not fetch tools."
						})
					);
				}
			});	
		},

		saveTools: function() {
			this.collection.save({

				// callbacks
				//
				success: function() {

					// show success notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							title: "Tool Changes Saved",
							message: "Your tool changes have been successfully saved."
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Your tool changes could not be saved."
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

			// show review tool filters
			//
			this.showFilters();

			// fetch and show review tools list
			//
			this.fetchAndShowList();
		},

		showFilters: function() {
			var self = this;

			// show tool filters
			//
			this.toolFilters.show(
				new ToolFiltersView({
					model: this.model,
					data: this.options.data? this.options.data : {},

					// callbacks
					//
					onChange: function() {
						// setQueryString(self.toolFilters.currentView.getQueryString());			
					
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

			// show review tools list
			//
			this.reviewToolsList.show(
				new ReviewToolsListView({
					collection: this.collection,
					showDeactivatedTools: this.$el.find('#show-deactivated-tools').is(':checked'),
					showNumbering: Registry.application.getShowNumbering(),
					showDelete: true
				})
			);
		},

		fetchAndShowList: function() {
			var self = this;

			// fetch and show review tools list
			//
			this.fetchTools(function() {
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

			// save all
			//
			this.saveTools();
		},

		onClickCancel: function() {

			// return to overview
			//
			Backbone.history.navigate('#overview', {
				trigger: true
			});
		},

		onClickShowDeactivatedTools: function() {
			this.reviewToolsList.currentView.options.showDeactivatedTools = this.$el.find('#show-deactivated-tools').is(':checked');
			this.reviewToolsList.currentView.render();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
