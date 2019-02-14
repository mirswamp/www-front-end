/******************************************************************************\
|                                                                              |
|                               performance-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog that is used to show the application            |
|        loading time performance.                                             |
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
	'marionette',
	'text!templates/dialogs/performance.tpl',
	'registry',
	'widgets/accordions',
], function($, _, Backbone, Marionette, Template, Registry, Accordions) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				config: Registry.application.config,
				timing: window.timing,
				collapsed: true
			});
		},

		onRender: function() {

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// dismiss modal dialog
			//
			Registry.application.modal.hide();

			// perform callback
			//
			if (this.options.accept) {
				this.options.accept();
			}
		}
	});
});
