/******************************************************************************\
|                                                                              |
|                                   usage-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of usage of the application over time.            |
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
	'text!templates/banner/usage.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				data: this.options.data
			});
		}
	});
});