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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/welcome.tpl',
	'config',
	'registry',
	'collections/tools/tools',
	'collections/platforms/platforms'
], function($, _, Backbone, Marionette, Template, Config, Registry, Tools, Platforms) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click #sign-in': 'onClickSignIn',
			'click #sign-up': 'onClickSignUp',
			'click .alert .close': 'onClickAlertClose',
			'click #forgot-password': 'onClickForgotPassword',
			'click #request-username': 'onClickRequestUsername'
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
			this.showLightBox();

			// populate tool and platform lists
			//
			this.showOpenToolsList();
			this.showCommercialToolsList();
			this.showPlatformsList();

			if (this.options.showSignIn) {
				this.showSignIn();
			}
		},

		showLightBox: function() {
			var self = this;
			require([
				'fancybox'
			], function (FancyBox) {

				// add fancybox to elements tagged as 'lightbox'
				//
				self.$el.find('.lightbox').fancybox({
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
			});
		},

		showOpenToolsList: function() {
			var self = this;
			new Tools().fetchPublic({

				// callbacks
				//
				success: function(tools) {
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
					Registry.application.error({
						message: "Could not fetch list of open tools."
					});
				}
			});
		},

		showCommercialToolsList: function() {
			var self = this;
			new Tools().fetchRestricted({

				// callbacks
				//
				success: function(tools) {

					// add tool names to list
					//
					for (var i = 0; i < tools.length; i++) {
						self.$el.find('#commercial-tools-list').append('<li>' + tools.at(i).get('name') + '</li>');
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.error({
						message: "Could not fetch list of commercial tools."
					});
				}
			});
		},

		showPlatformsList: function() {
			var self = this;
			new Platforms().fetchPublic({

				// callbacks
				//
				success: function(platforms) {

					// add platform names to list
					//
					for (var i = 0; i < platforms.length; i++) {
						self.$el.find('#platforms-list').append('<li>' + platforms.at(i).get('name') + '</li>');
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.error({
						message: "Could not fetch list of supported platforms."
					});
				}
			});
		},

		showSignIn: function() {
			require([
				'views/users/authentication/dialogs/sign-in-view'
			], function (SignInView) {

				// show sign in dialog
				//
				Registry.application.modal.show(
					new SignInView(), {
						focus: '#ok'
					}
				)
			});
		},

		showWarning: function(message) {
			this.$el.find('.alert-warning .message').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// event handling methods
		//

		onClickSignIn: function() {
			this.showSignIn();
		},

		onClickSignUp: function() {
			if (Registry.application.config['linked_accounts_enabled']) {
				require([
					'views/users/registration/dialogs/sign-up-view'
				], function (SignUpView) {

					// show sign up dialog
					//
					Registry.application.modal.show(
						new SignUpView()
					)
				});
			} else {

				// go to registration view
				//
				Backbone.history.navigate('#register', {
					trigger: true
				});
			}
		},

		onClickAlertClose: function() {
			this.hideWarning();
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
		},

		onKeyDown: function(event) {

			// respond to return key
			//
			if (event.keyCode == 13) {
				this.onClickSignIn();

			// respond to 'c' key press
			//
			} else if (event.keyCode === 67) {
				require([
					'views/dialogs/credits-view'
				], function (CreditsView) {

					// show credits view
					//
					Registry.application.modal.show(
						new CreditsView(), {
							size: 'large'
						}
					);
				});
			}
		}
	});
});
