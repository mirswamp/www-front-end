/******************************************************************************\
|                                                                              |
|                             user-profile-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of the user's profile              |
|        information.                                                          |
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
	'backbone',
	'marionette',
	'jquery.validate',
	'bootstrap/collapse',
	'bootstrap/tooltip',
	'bootstrap/popover',
	'bootstrap.select',
	'text!templates/users/user-profile/user-profile-form.tpl',
	'config',
	'registry',
	'views/widgets/selectors/name-selector-view'
], function($, _, Backbone, Marionette, Validate, Collapse, Tooltip, Popover, Select, Template, Config, Registry, NameSelectorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'blur #email': 'onBlurEmail'
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;

			// add numeric only validation rule
			//
			$.validator.addMethod('numericOnly', function (value, element) { 

				// allow empty values for optional fields
				//
				if (value == '') {
					return !$(element).hasClass('required');
				}

				return (/^[0-9]+$/.test(value));
			}, 'Please only enter numeric values (0-9)');

			// add numeric or dashes only validation rule (for phone numbers)
			//
			$.validator.addMethod('numericOrDashesOnly', function (value, element) {

				// allow empty values for optional fields
				//
				if (value == '') {
					return !$(element).hasClass('required');
				}

				return (/^[0-9,-]+$/.test(value));
			}, 'Please only enter numeric values (0-9)');

			// add alpha only validation rule
			//
			$.validator.addMethod('alphaOnly', function (value, element) {

				// allow empty values for optional fields
				//
				if (value == '') {
					return !$(element).hasClass('required');
				}

				return (/^[-\sa-zA-Z]+$/.test(value));
			}, 'Please only enter alphabet characters (letters, hyphens, and spaces)');

			// add alphanumeric validation rule
			//
			$.validator.addMethod('alphaNumericOnly', function (value, element) {

				// allow empty values for optional fields
				//
				if (value == '') {
					return !$(element).hasClass('required');
				}

				return (/^[0-9\sa-zA-Z]+$/.test(value));
			}, 'Please only enter alphabet characters (letters, hyphens, and spaces) or numbers');
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				config: Registry.application.config,
				showUserType: Registry.application.session.user.isAdmin()
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// validate the form
			//
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({
				rules: {
					'confirm-email': {
						required: true,
						equalTo: '#email'
					}
				},
				messages: {
					'first-name': {
						required: "Enter your given / first name"
					},
					'last-name': {
						required: "Enter your family / last name"
					},
					'preferred-name': {
						required: "Enter your preferred / nickname"
					},
					'email': {
						required: "Enter a valid email address",
						email: "This email address is not valid"
					},
					'confirm-email': {
						required: "Re-enter your email address",
						equalTo: "Retype the email address above"
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// form methods
		//

		update: function(model) {

			// get values from form
			//
			var firstName = this.$el.find('#first-name').val();
			var lastName = this.$el.find('#last-name').val();
			var preferredName = this.$el.find('#preferred-name').val();
			var affiliation = this.$el.find('#affiliation').val();
			var username = this.$el.find('#username').val();
			var email = this.$el.find('#email').val();
			var userType = this.$el.find('#user-type-selector').val();

			// update model
			//
			model.set({
				'first_name': firstName,
				'last_name': lastName,
				'preferred_name': preferredName,
				'affiliation': affiliation != '' ? affiliation : undefined,
				'user_type': userType != 'none' ? userType : undefined,
				'username': username,
				'email': email
			});
		},

		onBlurEmail: function(event) {
			var element = $(event.currentTarget);
			var email = event.currentTarget.value;

			if (email !== '' && email !== ' ' && email !== this.model.get('email')) {

				// check for username uniqueness
				//
				var response = this.model.checkValidation({
						'email': email
					}, {

					// callbacks
					//
					error: function() {
						var error = JSON.parse(response.responseText)[0];
						error = error.substr(0,1).toUpperCase() + error.substr(1);
						element.closest('.control-group').removeClass('success').addClass('error');
						element.closest('.control-group').find('.error').removeClass('valid');
						element.closest('.control-group').find('label.error').html(error);
					}
				});
			}
		}
	});
});
