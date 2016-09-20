/******************************************************************************\
|                                                                              |
|                              tools-nav-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing lists of the user's tools.          |
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
	'text!templates/tools/nav-list/tools-nav-list.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				user: this.model,
				collection: this.collection
			}));
		},

		onRender: function() {

			// update sidebar navigation highlighting
			//
			if (this.options.nav) {
				this.$el.find('.nav li').removeClass('active');
				this.$el.find('.nav li.' + this.options.nav).addClass('active');
			}
		}
	});
});