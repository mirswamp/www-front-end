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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/dialogs/performance.tpl',
	'registry'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #ok': 'onClickOk',
			'keypress': 'onKeyPress'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
			});
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
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
	        if (event.keyCode === 13) {
	            this.onClickOk();
	            Registry.application.modal.hide();
	        }
		}
	});
});
