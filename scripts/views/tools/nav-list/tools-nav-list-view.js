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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/nav-list/tools-nav-list.tpl',
	'views/base-view'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				user: this.model,
				collection: this.collection
			};
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