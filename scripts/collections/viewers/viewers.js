/******************************************************************************\
|                                                                              |
|                                    viewers.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of generic viewers.                    |
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
	'config',
	'models/viewers/viewer'
], function($, _, Backbone, Config, Viewer) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: Viewer,
		url: Config.servers.web + '/viewers',

		//
		// query methods
		//

		getNative: function() {
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);
				if (model.isNative()) {
					return model;
				}
			}
		},

		//
		// ajax methods
		//

		fetchAll: function(options) {
			options = options ? options : {};
			this.fetch( _.extend( options, {
				url: Config.servers.web + '/viewers/all'
			}));
		}
	});
});
