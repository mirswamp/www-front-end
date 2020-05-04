/******************************************************************************\
|                                                                              |
|                                  base-router.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for this application.        |
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
	'backbone'
], function($, _, Backbone) {

	// create router
	//
	return Backbone.Router.extend({

		//
		// route definitions
		//

		routes: {

			// no route found
			//
			'*404': 'showNotFound'
		},

		//
		// route handlers
		//

		showNotFound: function() {
			require([
				'views/not-found-view'
			], function (NotFoundView) {

				// show about view
				//
				application.showMain(new NotFoundView());
			});
		}
	});
});
