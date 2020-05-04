/******************************************************************************\
|                                                                              |
|                      user-validation-error-dialog-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an error dialog that is shown if a user tries to         |
|        to register a new user with invalid fields.                           |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/registration/dialogs/user-validation-error-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Template, DialogView) {
	'use strict';

	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'submit': 'onSubmit',
			'keypress': 'onKeyPress'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.options.title,
				errors: this.options.errors
			};
		},

		//
		// event handling methods
		//

		onSubmit: function() {
			if (this.options.accept) {
				this.options.accept();
			}

			// close modal dialog
			//
			this.dialog.hide();

			// disable default form submission
			//
			return false;
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {

				// close modal dialog
				//
				this.dialog.hide();

				// perform callback
				//
				this.onSubmit();
			}
		}
	});
});
