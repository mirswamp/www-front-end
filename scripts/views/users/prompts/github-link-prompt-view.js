/******************************************************************************\
|                                                                              |
|                        github-link-prompt-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the acceptable use policy view used in the new           |
|        GitHub link process.                                                  |
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
	'text!templates/users/prompts/github-link-prompt.tpl',
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
			'click #cancel': 'onClickCancel',
			'keypress': 'onKeyPress'
		},

		//
		// rendering methods
		//

		template: function(){
			return _.template(Template, {
				github_id: this.options.github_id,
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
		
		onKeyPress: function(event) {

			// respond to enter key press
			//
			if (event.keyCode === 13) {
				this.onClickSubmit();
			}
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
				User.requestGithubLink(username, password, this.options.github_id, false, {

					// callbacks
					//
					success: function() {

						// show success notify view
						//
						Registry.application.modal.show(
							new NotifyView({
								message: "Your GitHub account has been successfully linked.",

								// callbacks
								//
								accept: function() {
									Session.githubRedirect();
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
									message: "SWAMP account '" + info.username + "' was previously bound to another GitHub account.  " +
												"To connect your SWAMP account with GitHub account '" + info.login + "' instead, click 'Ok'.  " + 
												"Otherwise, click Cancel to maintain your current GitHub account connection.",
									
									// callbacks
									//
									accept: function() {

										// request github link
										//
										User.requestGithubLink(username, password, self.options.github_id, true, {

											// callbacks
											//
											success: function() {

												// show success notify view
												//
												Registry.application.modal.show(
													new NotifyView({
														message: "Your GitHub account has been successfully linked.",
														
														// callbacks
														//
														accept: function() {
															Session.githubRedirect();
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
