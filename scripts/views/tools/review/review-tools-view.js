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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/review/review-tools.tpl',
	'utilities/web/query-strings',
	'utilities/web/url-strings',
	'collections/tools/tools',
	'views/base-view',
	'views/tools/filters/tool-filters-view',
	'views/tools/review/review-tools-list/review-tools-list-view'
], function($, _, Template, QueryStrings, UrlStrings, Tools, BaseView, ToolFiltersView, ReviewToolsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			filters: '#tool-filters',
			list: '#review-tools-list'
		},

		events: {
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel',
			'click #show-deactivated-tools': 'onClickShowDeactivatedTools',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Tools();
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

		fetchTools: function(done) {
			var self = this;

			// fetch tools
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
						message: "Could not fetch tools."
					});
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
					application.notify({
						title: "Tool Changes Saved",
						message: "Your tool changes have been successfully saved."
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Your tool changes could not be saved."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				data: this.options.data
			};
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
			this.showChildView('filters', new ToolFiltersView({
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

			// preserve existing sorting column and order
			//
			if (this.getChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			// show review tools list
			//
			this.showChildView('list', new ReviewToolsListView({
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				showDeactivatedTools: this.$el.find('#show-deactivated-tools').is(':checked'),
				showDelete: false
			}));
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
			application.navigate('#overview');
		},

		onClickShowDeactivatedTools: function() {
			this.getChildView('list').options.showDeactivatedTools = this.$el.find('#show-deactivated-tools').is(':checked');
			this.getChildView('list').render();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		}
	});
});
