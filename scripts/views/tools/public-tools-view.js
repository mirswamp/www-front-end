/******************************************************************************\
|                                                                              |
|                                 public-tools-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for showing a list of publicly available tools.        |
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
	'text!templates/tools/public-tools.tpl',
	'collections/tools/tools',
	'views/base-view',
	'views/tools/list/tools-list-view'
], function($, _, Template, Tools, BaseView, ToolsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			open: "#open-tools-list",
			commercial: "#commercial-tools-list"
		},

		events: {
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {
			this.openTools = new Tools();
			this.commercialTools = new Tools();
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

			// show subviews
			//
			this.fetchAndShowLists();
		},

		showOpenToolsList: function() {

			// preserve existing sorting column and order
			//
			if (this.getChildView('open') && this.openTools.length > 0) {
				this.options.sortBy1 = this.getChildView('open').getSorting();
			}

			this.showChildView('open', new ToolsListView({
				collection: this.openTools,

				// options
				//
				sortBy: this.options.sortBy1,
				showDelete: false
			}));
		},

		showCommercialToolsList: function() {

			// preserve existing sorting column and order
			//
			if (this.getChildView('commercial') && this.commercialTools.length > 0) {
				this.options.sortBy2 = this.getChildView('commercial').getSorting();
			}

			this.showChildView('commercial', new ToolsListView({
				collection: this.commercialTools,

				// options
				//
				sortBy: this.options.sortBy2,
				showDelete: false
			}));
		},

		showLists: function() {
			this.showOpenToolsList();
			this.showCommercialToolsList();
		},

		//
		// ajax fetching methods
		//

		fetchAndShowOpenToolsList: function() {
			var self = this;
			this.openTools.fetchPublic({

				// callbacks
				//
				success: function() {
					self.showOpenToolsList();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get list of public open tools."
					});
				}
			});
		},

		fetchAndShowCommercialToolsList: function() {
			var self = this;
			this.commercialTools.fetchRestricted({

				// callbacks
				//
				success: function(collection) {
					self.showCommercialToolsList();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get list of public commercial tools."
					});
				}
			});
		},

		fetchAndShowLists: function() {
			this.fetchAndShowOpenToolsList();
			this.fetchAndShowCommercialToolsList();
		},

		//
		// event handling methods
		//

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		}
	});
});
