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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'tooltip',
	'text!templates/layout/footer.tpl'
], function($, _, Backbone, Marionette, Tooltip, Template) {
	return Backbone.Marionette.ItemView.extend({

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
			var self = this;
			require([
				'registry',
				'views/dialogs/performance-view'
			], function (Registry, PerformanceView) {
				Registry.application.modal.show(
					new PerformanceView()
				);
			});
		},

		//
		// event handling methods
		//

		onClickPerformance: function() {
			this.showPerformanceDialog();
		}
	});
});
