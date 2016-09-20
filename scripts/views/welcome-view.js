/******************************************************************************\
|                                                                              |
|                                  welcome-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the introductory view of the application.                |
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
	'fancybox',
	'text!templates/welcome.tpl',
	'config',
	'registry',
	'collections/tools/tools',
	'collections/platforms/platforms',
	'views/users/dialogs/email-verification-error-view',
	'views/users/authentication/dialogs/sign-in-view',
	'views/dialogs/error-view',
	'views/dialogs/credits-view'
], function($, _, Backbone, Marionette, FancyBox, Template, Config, Registry, Tools, Platforms, EmailVerificationErrorView, SignInView, ErrorView, CreditsView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #sign-in': 'onClickSignIn',
			'click #register': 'onClickRegister',
			'click #github': 'onClickGitHub',
			'click .alert .close': 'onClickAlertClose',
			'click #forgot-password': 'onClickForgotPassword',
			'click #request-username': 'onClickRequestUsername',
			'keydown': 'onKeyPress'
		},

		//
		// methods
		//

		initialize: function() {
			this.$el.attr('tabindex', 1);
			this.$el.focus();
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				config: Registry.application.config
			});
		},

		onRender: function() {

			// add fancybox to elements tagged as 'lightbox'
			//
			this.$el.find('.lightbox').fancybox({
				'padding': 10,
				'margin': 40,
				'openEffect': 'elastic',
				'closeEffect': 'elastic',

				// callbacks
				//
				'onStart' : function(){},
				'onCancel' : function(){},
				'onComplete' : function(){},
				'onCleanup' : function(){},
				'onClosed' : function(){},
				'onError' : function(){}
			});

			// populate tool and platform lists
			//
			this.showOpenToolsList();
			this.showCommercialToolsList();
			this.showPlatformsList();
		},

		showWarning: function(message) {
			this.$el.find('.alert-warning .message').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		showOpenToolsList: function() {
			var self = this;
			var tools = new Tools();
			tools.fetchPublic({

				// callbacks
				//
				success: function() {
					tools = tools.getOpen();

					// add tool names to list
					//
					for (var i = 0; i < tools.length; i++) {
						self.$el.find('#open-tools-list').append('<li>' + tools.at(i).get('name') + '</li>');
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch list of open tools."
						})
					);
				}
			});
		},

		showCommercialToolsList: function() {
			var self = this;
			var tools = new Tools();
			tools.fetchRestricted({

				// callbacks
				//
				success: function() {

					// add tool names to list
					//
					for (var i = 0; i < tools.length; i++) {
						self.$el.find('#commercial-tools-list').append('<li>' + tools.at(i).get('name') + '</li>');
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch list of commercial tools."
						})
					);
				}
			});
		},

		showPlatformsList: function() {
			var self = this;
			var platforms = new Platforms();
			platforms.fetchPublic({

				// callbacks
				//
				success: function() {

					// add platform names to list
					//
					for (var i = 0; i < platforms.length; i++) {
						self.$el.find('#platforms-list').append('<li>' + platforms.at(i).get('name') + '</li>');
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch list of supported platforms."
						})
					);
				}
			});
		},

		//
		// event handling methods
		//

		onClickSignIn: function() {
			require([
				'views/users/dialogs/sign-in-view'
			], function (SignInView) {

				// show sign in dialog
				//
				Registry.application.modal.show(
					new SignInView()
				)
			});
		},

		onClickRegister: function() {
			Backbone.history.navigate('#register', {
				trigger: true
			});
		},

		onClickGitHub: function() {
			require([
				'models/users/session'
			], function (Session) {

				// redirect to github
				//
				Session.githubRedirect();
			});
		},

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {

				// show sign in dialog
				//
				Registry.application.modal.show(
					new SignInView()
				);
			} else if (event.keyCode === 67) {

				// show credits view
				//
				Registry.application.modal.show(
					new CreditsView(), {
						size: 'large'
					}
				);	
			}
		},

		onClickForgotPassword: function() {
			require([
				'views/users/authentication/dialogs/reset-password-view'
			], function (ResetPasswordView) {

				// show reset password view
				//
				Registry.application.modal.show(
					new ResetPasswordView({
						parent: this
					})
				);
			});
		},

		onClickRequestUsername: function() {
			require([
				'views/users/authentication/dialogs/request-username-view'
			], function (RequestUsernameView) {

				// show request username view
				//
				Registry.application.modal.show(
					new RequestUsernameView({
						parent: this
					})
				);
			});
		}
	});
});
