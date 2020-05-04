/******************************************************************************\
|                                                                              |
|                             notify-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        modal notify / alert dialog box.                                      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/dialogs/notify-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Template, DialogView) {
	'use strict';
	
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #ok': 'onClickOk',
			'keypress': 'onKeyPress'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.options.title,
				message: this.options.message
			};
		},

		//
		// event handling methods
		//

		onClickOk: function() {

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

				// close modal dialog
				//
				this.hide();

				// perform callback
				//
				this.onClickOk();
			}
		}
	});
});
