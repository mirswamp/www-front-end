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
	'backbone',
	'marionette',
	'text!templates/tools/public-tools.tpl',
	'registry',
	'collections/tools/tools',
	'views/dialogs/error-view',
	'views/tools/list/tools-list-view'
], function($, _, Backbone, Marionette, Template, Registry, Tools, ErrorView, ToolsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			openToolsList: "#open-tools-list",
			commercialToolsList: "#commercial-tools-list"
		},

		events: {
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Tools();
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
					self.openToolsList.show(
						new ToolsListView({
							collection: self.collection.getOpen(),
							showNumbering: Registry.application.options.showNumbering,
							showDelete: false
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get list of public tools."
						})
					);
				}
			})
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
					self.commercialToolsList.show(
						new ToolsListView({
							collection: collection,
							showNumbering: Registry.application.options.showNumbering,
							showDelete: false
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get list of public tools."
						})
					);
				}
			})
		},

		showLists: function() {
			this.showOpenToolsList();
			this.showCommercialToolsList();
		},

		//
		// event handling methods
		//

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showLists();
		}
	});
});
