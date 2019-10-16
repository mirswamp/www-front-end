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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/layout/main.tpl',
	'views/base-view'
], function($, _, Template, BaseView) {
	return BaseView.extend({

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
			this.showChildView('content', this.options.contentView);
		}
	});
});
