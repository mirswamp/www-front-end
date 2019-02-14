/******************************************************************************\
|                                                                              |
|                                  subscribe-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the a view for subscribing to our mailing list.          |
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
	'bootstrap/tooltip',
	'bootstrap/popover',
	'marionette',
	'text!templates/info/mailing-list/subscribe.tpl'
], function($, _, Backbone, Tooltip, Popover, Marionette, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// scroll to top
			//
			$(document).scrollTop(0);
		}
	});
});
