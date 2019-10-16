/******************************************************************************\
|                                                                              |
|                            sign-up-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines dialog that is used to register a new user.              |
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
	'bootstrap/popover',
	'text!templates/users/registration/dialogs/sign-up-dialog.tpl',
	'views/dialogs/dialog-view',
	'views/users/registration/forms/sign-up-form-view'
], function($, _, Popover, Template, DialogView, SignUpFormView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: ".modal-body"
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// show subviews
			//
			this.showChildView('form', new SignUpFormView({

				// callbacks
				//
				onClick: function() {

					// close dialog 
					//
					self.hide();
				}
			}));

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		}
	});
});
