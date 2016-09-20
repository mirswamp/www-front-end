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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
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
			'click #ok': 'onClickOk',
			'keypress': 'onKeyPress'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template);
		},

		onRender: function() {

			// show subviews
			//
			this.signInForm.show(
				new SignInFormView()
			);

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
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
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {
				this.onClickOk();
			}
		},
	});
});
