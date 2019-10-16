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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/platforms/public-platforms.tpl',
	'collections/platforms/platforms',
	'views/base-view',
	'views/platforms/list/platforms-list-view'
], function($, _, Template, Platforms, BaseView, PlatformsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#platforms-list'
		},

		events: {
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Platforms();
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
			this.fetchAndShowList();
		},

		fetchAndShowList: function() {
			var self = this;
			this.collection.fetchPublic({

				// callbacks
				//
				success: function() {

					// show list of platforms
					//
					self.showList();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get list of platforms."
					});
				}
			});
		},

		showList: function() {

			// show list of platforms
			//
			this.showChildView('list', new PlatformsListView({
				collection: this.collection,
				showNumbering: application.options.showNumbering,
				showDelete: false
			}));	
		},

		//
		// event handling methods
		//

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
