/******************************************************************************\
|                                                                              |
|                             report-incident-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the about/information view of the application.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/collapse',
	'text!templates/contacts/report-incident.tpl',
	'config',
	'models/utilities/contact',
	'views/base-view',
	'views/contacts/contact-profile/new-security-incident-form-view'
], function($, _, Collapse, Template, Config, Contact, BaseView, NewSecurityIncidentFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#new-contact-profile-form'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #submit': 'onClickSubmit',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			this.model = new Contact({});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				contact: Config.contact
			};
		},

		onRender: function() {
			
			// show new contact profile form
			//
			if (application.config.email_enabled && application.config.contact_form_enabled) {
				this.showChildView('form', new NewSecurityIncidentFormView({
					model: this.model
				}));
			}
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickSubmit: function() {

			// check validation
			//
			if (!this.getChildView('form').submit({

				// callbacks
				//
				success: function() {

					// show success notification dialog
					//
					application.notify({
						title: "Message Sent",
						message: "Thank you for your feedback.",

						// callbacks
						//
						accept: function() {

							// go to home view
							//
							application.navigate('#home');
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not send contact info."
					});
				}
			})) {

				// display error message
				//
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to home view
			//
			application.navigate('#home');
		}
	});
});