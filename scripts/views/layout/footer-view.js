/******************************************************************************\
|                                                                              |
|                                 footer-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application footer and associated content.           |
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
	'text!templates/layout/footer.tpl',
	'views/base-view',
	'views/dialogs/performance-dialog-view'
], function($, _, Template, BaseView, PerformanceDialogView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #performance': 'onClickPerformance'
		},

		//
		// rendering methods
		//

		onShow: function() {
			
			// show tooltips
			//
			this.$el.find("[data-toggle='tooltip']").tooltip({
				trigger: 'hover'
			});
		},

		showPerformanceDialog: function() {
			application.show(new PerformanceDialogView());
		},

		//
		// event handling methods
		//

		onClickPerformance: function() {
			this.showPerformanceDialog();
		}
	});
});
