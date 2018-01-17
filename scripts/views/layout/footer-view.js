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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/tooltip',
	'registry',	
	'text!templates/layout/footer.tpl',
	'views/dialogs/performance-view'
], function($, _, Backbone, Marionette, Tooltip, Registry, Template, PerformanceView) {
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
			Registry.application.modal.show(
				new PerformanceView()
			);
		},

		//
		// event handling methods
		//

		onClickPerformance: function() {
			this.showPerformanceDialog();
		}
	});
});
