/******************************************************************************\
|                                                                              |
|                                    main-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the main single column outer container view.             |
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
	'text!templates/layout/main.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			content: '.content'
		},

		//
		// rendering methods
		//

		onRender: function() {

			// show content view
			//
			this.content.show(
				this.options.contentView
			);
		}
	});
});
