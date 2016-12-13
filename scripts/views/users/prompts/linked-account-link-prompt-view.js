/******************************************************************************\
|                                                                              |
|                       linked-account-link-prompt-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the link prompt view used in the linked account          |
|        authentication process.                                               |
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
	'text!templates/users/prompts/linked-account-link-prompt.tpl',
	'registry',
	'config',
	'models/users/user',
	'models/users/session',
	'views/dialogs/notify-view',
	'views/dialogs/confirm-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Template, Registry, Config, User, Session, NotifyView, ConfirmView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click .alert-warning .close': 'onClickAlertWarningClose',
			'click .alert-info .close': 'onClickAlertInfoClose',
			'click #submit': 'onClickSubmit',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function(){
			return _.template(Template, {
				oauth2_id: this.options.oauth2_id,
				username: this.options.username,
				email: this.options.email
			});
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		showWarning: function(message) {
			this.$el.find('.alert-warning .message').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		showInfo: function(message) {
			this.$el.find('.alert-info .message').html(message);
			this.$el.find('.alert-info').show();
		},

		hideInfo: function() {
			this.$el.find('.alert-info').hide();
		},

		//
		// validation methods
		//

		isValid: function() {
			if (this.$el.find('#username').val() && this.$el.find('#password').val()) {
				return true;
			}
			return false;
		},

		//
		// event handling methods
		//

		onClickAlertWarningClose: function() {
			this.hideWarning();
		},

		onClickAlertInfoClose: function() {
			this.hideInfo();
		},

		onClickSubmit: function() {
			var self = this;

			// check form validation
			//
			if (this.isValid()) {

				// get form values
				//
				var username = this.$el.find('#username').val();
				var password = this.$el.find('#password').val();

				// request link
				//
				User.requestLinkedAccountLink(username, password, this.options.oauth2_id, false, {

					// callbacks
					//
					success: function() {

						// show success notify view
						//
						Registry.application.modal.show(
							new NotifyView({
								message: "Your account has been successfully linked.",

								// callbacks
								//
								accept: function() {
									Session.linkedAccountRedirect();
								}
							})
						);
					},

					error: function(response) {
						if (response.responseText.indexOf('EXISTING_ACCOUNT') > -1) {
							var info = JSON.parse(response.responseText);

							// show error notify view
							//
							Registry.application.modal.show(
								new ConfirmView({
									message: "SWAMP account '" + info.username + "' was previously bound to another linked account.  " +
												"To connect your SWAMP account with the account '" + info.login + "' instead, click 'Ok'.  " + 
												"Otherwise, click Cancel to maintain your current linked account account connection.",
									
									// callbacks
									//
									accept: function() {

										// request link
										//
										User.requestLinkedAccountLink(username, password, self.options.oauth2_id, true, {

											// callbacks
											//
											success: function() {

												// show success notify view
												//
												Registry.application.modal.show(
													new NotifyView({
														message: "Your account has been successfully linked.",
														
														// callbacks
														//
														accept: function() {
															Session.linkedAccountRedirect();
														}
													})
												);
											},

											error: function(response) {

												// disable submit button
												//
												self.$el.find("#submit").prop('disabled', true);
							
												// show warning
												//
												self.showWarning(response.responseText);
											}
										});
									},

									reject: function() {
										Backbone.history.navigate("#home", {
											trigger: true
										});
									}
								})
							);
						} else {

							// disable submit button
							//
							self.$el.find("#submit").prop('disabled', true);

							// check for conflict
							//
							if (response.status == 409) {
								self.showInfo(response.responseText + "  " +
									"If you have any questions, email us at " + Config.contact.security.email + " or call our 24/7 support line at " + Config.contact.support.phoneNumber);
							} else {

								// show warning
								//
								self.showWarning(response.responseText);
							}
						}
					}
				});
			}
		},

		onClickCancel: function() {

			// go to home view
			//
			Backbone.history.navigate('#home', {
				trigger: true
			});
		}
	});
});
