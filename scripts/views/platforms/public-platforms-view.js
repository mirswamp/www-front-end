/******************************************************************************\
|                                                                              |
|                                public-platforms-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for showing a list of publicly available platforms.    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/platforms/public-platforms.tpl',
	'registry',
	'collections/platforms/platforms',
	'views/dialogs/error-view',
	'views/platforms/list/platforms-list-view'
], function($, _, Backbone, Marionette, Template, Registry, Platforms, ErrorView, PlatformsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			platformsList: '#platforms-list'
		},

		events: {
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Platforms();
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
			this.showList();
		},

		showList: function() {
			var self = this;
			this.collection.fetchPublic({

				// callbacks
				//
				success: function() {

					// show list of platforms
					//
					self.platformsList.show(
						new PlatformsListView({
							collection: self.collection,
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
							message: "Could not get list of platforms."
						})
					);
				}
			})
		},

		//
		// event handling methods
		//

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
