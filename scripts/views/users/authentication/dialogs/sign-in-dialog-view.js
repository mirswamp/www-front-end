/******************************************************************************\
|                                                                              |
|                            sign-in-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is used to sign in to the app.         |
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
	'text!templates/users/authentication/dialogs/sign-in-dialog.tpl',
	'views/dialogs/dialog-view',
	'views/users/authentication/forms/sign-in-form-view',
	'utilities/web/query-strings'
], function($, _, Popover, Template, DialogView, SignInFormView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: ".modal-body"
		},

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				config: application.config,
				showHelpButtons: true,
				disabled: application.authProvider == undefined
			};
		},

		onRender: function() {
			var self = this;

			// show subviews
			//
			this.showChildView('form', new SignInFormView({
				parent: this,

				// callback
				//
				onChange: function() {
					self.update();
				}
			}));

			// enable ok button
			//
			this.$el.find('#ok').prop('disabled', false);	

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		update: function() {
			/*
			if (this.getChildView('form').isValid()) {

				// enable ok button
				//
				this.$el.find('#ok').prop('disabled', false);			
			} else {

				// disable ok button
				//
				this.$el.find('#ok').prop('disabled', true);
			}
			*/
		},

		//
		// methods
		//

		signIn: function() {
			var self = this;
			
			// get user information
			//
			application.session.getUser({
				success: function(user) {
					application.session.user = user;

					// go to current view
					//
					Backbone.history.loadUrl('#' + (getFragment() || ''));
				}
			});

			// close dialog
			//
			this.hide();
		},

		//
		// event handling methods
		//

		onClickOk: function() {
			var self = this;

			// make login request
			//
			this.getChildView('form').submit({

				// callbacks
				//
				success: function() {
					self.signIn();
				}
			});
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			application.signingIn = false;
		}
	});
});
