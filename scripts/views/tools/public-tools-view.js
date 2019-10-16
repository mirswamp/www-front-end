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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
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
			this.collection = new Tools();
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

			// show subviews
			//
			this.showOpenToolsList();
			this.showCommercialToolsList();
		},

		showOpenToolsList: function() {
			var self = this;
			this.collection.fetchPublic({

				// callbacks
				//
				success: function() {

					// show list of open tools
					//
					self.showChildView('open', new ToolsListView({
						collection: self.collection.getOpen(),
						showNumbering: application.options.showNumbering,
						showDelete: false
					}));
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get list of public tools."
					});
				}
			});
		},

		showCommercialToolsList: function() {
			var self = this;
			var collection = new Tools();
			collection.fetchRestricted({

				// callbacks
				//
				success: function() {

					// show list of commercial tools
					//
					self.showChildView('commercial', new ToolsListView({
						collection: collection,
						showNumbering: application.options.showNumbering,
						showDelete: false
					}));
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get list of public tools."
					});
				}
			});
		},

		showLists: function() {
			this.showOpenToolsList();
			this.showCommercialToolsList();
		},

		//
		// event handling methods
		//

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showLists();
		}
	});
});
