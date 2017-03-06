/******************************************************************************\
|                                                                              |
|                                  sign-in-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        modal sign in dialog box.                                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'popover',
	'text!templates/users/authentication/dialogs/sign-in.tpl',
	'registry',
	'views/users/authentication/forms/sign-in-form-view'
], function($, _, Backbone, Marionette, Popover, Template, Registry, SignInFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			signInForm: "#sign-in-form"
		},

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				config: Registry.application.config,
				showHelpButtons: true,
				disabled: Registry.application.authProvider == undefined
			}));
		},

		onRender: function() {
			var self = this;

			// show subviews
			//
			this.signInForm.show(
				new SignInFormView({
					parent: this,

					// callback
					//
					onChange: function() {
						self.update();
					}
				})
			);

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		onShown: function() {

			// perform initial validation
			//
			this.update();

			// set focus
			//
			if (this.signInForm.currentView.isValid()) {

				// set focus to ok button
				//
				this.$el.find('#ok').focus();
			} else {

				// set focus to first input field
				//
				this.$el.find('#username input').focus();
			}
		},

		update: function() {
			if (this.signInForm.currentView.isValid()) {

				// enable ok button
				//
				this.$el.find('#ok').prop('disabled', false);			
			} else {

				// disable ok button
				//
				this.$el.find('#ok').prop('disabled', true);
			}
		},

		//
		// methods
		//

		showHome: function() {

			// remove event handlers
			//
			this.undelegateEvents();

			// go to home view
			//
			Backbone.history.navigate('#home', {
				trigger: true
			});
		},

		signIn: function() {
			var self = this;
			
			// get user information
			//
			Registry.application.session.getUser({
				success: function(user) {
					Registry.application.session.user = user;
					self.showHome();
				}
			});

			// close dialog
			//
			Registry.application.modal.hide();
		},

		//
		// event handling methods
		//

		onClickOk: function() {
			var self = this;

			// make login request
			//
			this.signInForm.currentView.submit({

				// callbacks
				//
				success: function() {
					self.signIn();
				}
			});
		}
	});
});
