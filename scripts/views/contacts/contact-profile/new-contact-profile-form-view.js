/******************************************************************************\
|                                                                              |
|                        new-contact-profile-form-view.js                      |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'validate',
	'tooltip',
	'popover',
	'text!templates/contacts/contact-profile/new-contact-profile-form.tpl',
	'registry',
	'widgets/accordions',
	'models/contacts/contact'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Registry, Accordions, Contact) {
	return Backbone.Marionette.ItemView.extend({

		//
		// methods
		//

		initialize: function() {
			this.model = new Contact();
			
			// set contact to current user
			//
			if (Registry.application.session.user) {
				this.model.setUser(Registry.application.session.user);
			}

			// add numeric only validation rule
			//
			$.validator.addMethod('numericOnly', function (value) {
				return (value === '') || (/^[0-9]+$/.test(value));
			}, 'Please only enter numeric values (0-9)');

			// add numeric or dashes only validation rule (for phone numbers)
			//
			$.validator.addMethod('numericOrDashesOnly', function (value) {
				return (value === '') || (/^[0-9,-]+$/.test(value));
			}, 'Please only enter numeric values (0-9)');
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collapsed: this.model.has('email')
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));

			// validate form
			//
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({
				messages: {
					'first-name': {
						required: "Enter your given / first name"
					},
					'last-name': {
						required: "Enter your family / last name"
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// form processing methods
		//

		update: function(model) {

			// get values from form
			//
			var firstName = this.$el.find('#first-name').val();
			var lastName = this.$el.find('#last-name').val();
			var email = this.$el.find('#email').val();
			var subject = this.$el.find('#subject').val();
			var question = this.$el.find('#question').val();

			// update model
			//
			model.set({
				'first_name': firstName,
				'last_name': lastName,
				'email': email,
				'subject': subject,
				'question': question
			});
		}
	});
});
