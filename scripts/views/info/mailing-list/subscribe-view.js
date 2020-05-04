/******************************************************************************\
|                                                                              |
|                               subscribe-view.js                              |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/popover',
	'text!templates/info/mailing-list/subscribe.tpl',
	'views/base-view'
], function($, _, Popover, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

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
