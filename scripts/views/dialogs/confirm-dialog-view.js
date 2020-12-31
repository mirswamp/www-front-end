/******************************************************************************\
|                                                                              |
|                            confirm-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a confirmation modal dialog box that is used to          |
|        prompt the user for confirmation to proceed with some action.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/dialogs/confirm-dialog.tpl',
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
			'click #cancel': 'onClickCancel',
			'keypress': 'onKeyPress'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.options.title,
				message: this.options.message,
				ok: this.options.ok,
				cancel: this.options.cancel
			};
		},

		//
		// event handling methods
		//

		onClickOk: function() {
			if (this.options.accept) {
				return this.options.accept();
			}
		},

		onClickCancel: function() {

			// perform callback
			//
			if (this.options.reject) {
				this.options.reject();
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
