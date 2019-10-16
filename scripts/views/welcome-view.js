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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/welcome.tpl',
	'models/utilities/usage',
	'collections/tools/tools',
	'collections/platforms/platforms',
	'views/base-view',
	'views/banner/usage-view'
], function($, _, Template, Usage, Tools, Platforms, BaseView, UsageView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			'banner': '#banner'
		},

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

		templateContext: function() {
			return {
				config: application.config
			};
		},

		onRender: function() {
			this.showLightBox();

			// sub child views
			//
			this.showOpenToolsList();
			this.showCommercialToolsList();
			this.showPlatformsList();

			// show optional child views
			//
			if (application.config.stats_enabled) {
				this.showBanner();
			}
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

		showBanner: function() {
			var self = this;
			new Usage.fetch({ 
				'which': 'latest',

				// callbacks
				//
				success: function(data) {
					self.showChildView('banner', new UsageView({
						data: data
					}));
				}
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

					// show error message
					//
					application.error({
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

					// show error message
					//
					application.error({
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

					// show error message
					//
					application.error({
						message: "Could not fetch list of supported platforms."
					});
				}
			});
		},

		showSignIn: function() {
			require([
				'views/users/authentication/dialogs/sign-in-dialog-view'
			], function (SignInDialogView) {

				// show sign in dialog
				//
				application.show(new SignInDialogView(), {
					focus: '#ok'
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
			this.showSignIn();
		},

		onClickSignUp: function() {
			if (application.config['linked_accounts_enabled']) {
				require([
					'views/users/registration/dialogs/sign-up-dialog-view'
				], function (SignUpDialogView) {

					// show sign up dialog
					//
					application.show(new SignUpDialogView());
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
				'views/users/authentication/dialogs/reset-password-dialog-view'
			], function (ResetPasswordDialogView) {

				// show reset password view
				//
				application.show(new ResetPasswordDialogView({
					parent: this
				}));
			});
		},

		onClickRequestUsername: function() {
			require([
				'views/users/authentication/dialogs/request-username-dialog-view'
			], function (RequestUsernameDialogView) {

				// show request username view
				//
				application.show(new RequestUsernameDialogView({
					parent: this
				}));
			});
		},

		onKeyDown: function(event) {

			// respond to return key
			//
			if (event.keyCode == 13 && $('button:focus').length == 0) {
				this.onClickSignIn();

			// respond to 'c' key press
			//
			} else if (event.keyCode === 67) {
				require([
					'views/dialogs/credits-dialog-view'
				], function (CreditsDialogView) {

					// show credits view
					//
					application.show(new CreditsDialogView());
				});
			}
		}
	});
});
