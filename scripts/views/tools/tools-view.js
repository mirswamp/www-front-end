/******************************************************************************\
|                                                                              |
|                                    tools-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for showing a list of user tools.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/tools.tpl',
	'collections/tools/tools',
	'views/base-view',
	'views/tools/filters/tool-filters-view',
	'views/tools/list/tools-list-view',
	'utilities/web/query-strings',
	'utilities/web/url-strings'
], function($, _, Template, Tools, BaseView, ToolFiltersView, ToolsListView, QueryStrings, UrlStrings) {
	return BaseView.extend({

		//
		// attributes
		//
		
		template: _.template(Template),

		regions: {
			filters: '#tool-filters',
			list: '#tools-list'
		},

		events: {
			'click #reset-filters': 'onClickResetFilters',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Tools();
		},

		//
		// query string / filter methods
		//

		getFilterData: function() {
			if (this.getChildView('filters')) {
				var data = this.getChildView('filters').getData();

				// nuke unneeded project data
				//
				delete data.project;

				return data;
			}
		},

		getFilterAttrs: function() {
			if (this.getChildView('filters')) {
				var attrs = this.getChildView('filters').getAttrs();

				// nuke unneeded project attributes
				//
				delete attrs.project_uuid;

				return attrs;
			}
		},

		//
		// ajax methods
		//

		fetchTools: function(done) {
			var self = this;

			// fetch tools
			//
			this.collection.fetch({

				// attributes
				//
				data: this.getFilterData(),

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get tools for this project."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				loggedIn: application.session.user != null
			};
		},

		onRender: function() {
			var self = this;

			// show tool filters view
			//
			this.showChildView('filters', new ToolFiltersView({
				model: this.model,
				data: this.options.data? this.options.data : {},

				// callbacks
				//
				onChange: function() {
					setQueryString(self.getChildView('filters').getQueryString());			
				}
			}));

			// fetch and show tools
			//
			this.fetchTools(function() {
				self.showList();
			});
		},

		showList: function() {

			// preserve existing sorting column and order
			//
			if (this.getChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			this.showChildView('list', new ToolsListView({
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy
			}));
		},

		//
		// event handling methods
		//

		onClickResetFilters: function() {
			this.getChildView('filters').reset();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		}
	});
});
