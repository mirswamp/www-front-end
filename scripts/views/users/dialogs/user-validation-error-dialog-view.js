/******************************************************************************\
|                                                                              |
|                    user-validation-error-dialog-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an error dialog that is shown if a user tries to         |
|        to register a new user with invalid fields.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/dialogs/user-validation-error-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Template, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'submit': 'onSubmit'
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

			// perform callback
			//
			if (this.options.accept) {
				this.options.accept();
			}

			// close dialog
			//
			this.hide();

			// disable default form submission
			//
			return false;
		}
	});
});
