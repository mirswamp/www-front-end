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
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Template, Config, Registry, ErrorView) {
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
		},


		onShow: function() {
			var self = this;

			/*
			// capture all key events
			//
			$('main').on('keypress', function(event) {

				// if no modal is open
				//
				if ($('modal-backdrop').length == 0) {
					self.onKeyPress(event);
				}
			});
			*/
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
			require([
				'collections/tools/tools'
			], function (Tools) {
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
			});
		},

		showCommercialToolsList: function() {
			var self = this;
			require([
				'collections/tools/tools'
			], function (Tools) {
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
			});
		},

		showPlatformsList: function() {
			var self = this;
			require([
				'collections/platforms/platforms',
			], function (Platforms) {
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

		onKeyPress: function(event) {

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
