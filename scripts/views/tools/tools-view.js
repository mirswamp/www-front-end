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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/tools/tools.tpl',
	'registry',
	'utilities/query-strings',
	'utilities/url-strings',
	'collections/tools/tools',
	'views/dialogs/error-view',
	'views/tools/filters/tool-filters-view',
	'views/tools/list/tools-list-view'
], function($, _, Backbone, Marionette, Template, Registry, QueryStrings, UrlStrings, Tools, ErrorView, ToolFiltersView, ToolsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//
		
		template: _.template(Template),

		regions: {
			toolFilters: '#tool-filters',
			toolsList: '#tools-list'
		},

		events: {
			'click #reset-filters': 'onClickResetFilters',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Tools();
		},

		//
		// query string / filter methods
		//

		getFilterData: function() {
			if (this.toolFilters.currentView) {
				var data = this.toolFilters.currentView.getData();

				// nuke unneeded project data
				//
				delete data['project'];

				return data;
			}
		},

		getFilterAttrs: function() {
			if (this.toolFilters.currentView) {
				var attrs = this.toolFilters.currentView.getAttrs();

				// nuke unneeded project attributes
				//
				delete attrs['project_uuid'];

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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get tools for this project."
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
				showNumbering: Registry.application.getShowNumbering()
			}));
		},

		onRender: function() {
			var self = this;

			// show tool filters view
			//
			this.toolFilters.show(
				new ToolFiltersView({
					model: this.model,
					data: this.options.data? this.options.data : {},

					// callbacks
					//
					onChange: function() {
						setQueryString(self.toolFilters.currentView.getQueryString());			
					}
				})
			);

			// fetch and show tools
			//
			this.fetchTools(function() {
				self.showList();
			});
		},

		showList: function() {
			this.toolsList.show(
				new ToolsListView({
					collection: this.collection,
					showNumbering: Registry.application.getShowNumbering()
				})
			);
		},

		//
		// event handling methods
		//

		onClickResetFilters: function() {
			this.toolFilters.currentView.reset();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
