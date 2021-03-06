/******************************************************************************\
|                                                                              |
|                         new-user-profile-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a new user's profile info.           |
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
	'bootstrap/popover',
	'text!templates/users/accounts/user-profile/new-user-profile-form.tpl',
	'views/forms/form-view',
	'views/widgets/selectors/country-selector-view',
	'utilities/security/password-policy'
], function($, _, Popover, Template, FormView, CountrySelectorView, PasswordPolicy) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			selector: '#country-selector'
		},

		events: {
			// 'change #username': 'onChangeUsername',
			// 'change #email': 'onChangeEmail',
			'change #promo-code': 'onChangePromoCode',
			'change #class-code': 'onChangeClassCode'
		},

		showPasswordMeter: false,

		//
		// form attributes
		//

		rules: {
			'username': {
				required: true,
				username: true						
			},
			'confirm-email': {
				required: true,
				equalTo: '#email'
			},
			'password': {
				required: true,
				passwordValid: true
			},
			'confirm-password': {
				required: true,
				equalTo: '#password'
			},
			'country-code': {
				numericOnly: true
			},
			'area-code': {
				numericOnly: true
			},
			'state': {
				alphaOnly: true
			},
			'phone-number': {
				numericOrDashesOnly: true
			}
		},

		messages: {
			'first-name': {
				required: "Enter your given / first name."
			},
			'last-name': {
				required: "Enter your family / last name."
			},
			'preferred-name': {
				required: "Enter your preferred / nickname."
			},
			'email': {
				required: "Enter a valid email address.",
				email: "This email address is not valid."
			},
			'confirm-email': {
				required: "Re-enter your email address.",
				equalTo: "Retype the email address above."
			},
			'username': {
				required: "Enter a username / login.",
				minlength: $.validator.format("Enter at least {0} characters.")
			},
			'swamp-password': {
				required: "Enter a password."
			},
			'confirm-password': {
				required: "Re-enter your password.",
				equalTo: "Enter the same password as above."
			}
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;

			// add username validation rule
			//
			$.validator.addMethod('username', function(value, element) {
				return typeof(value) == 'string' && /^[\u0040-\u1FE0\u2C00-\uFFC00-9 ._-]+$/i.test(value);
			}, "Your username must contain only letters and numbers, the period, underscore, and hyphen.");
			
			// add password validation rule
			//
			$.validator.addMethod('passwordValid', function(value, element) {
				if ($(element).attr('name') == 'confirm-password') {
					return true;
				}
				var username = self.$el.find('#username').val();
				var rating = $.validator.passwordRating(value, username);

				// update meter
				//
				if (this.showPasswordMeter) {
					var meter = $('.password-meter', element.form);
					meter.show();
					meter.find('.password-meter-bar').removeClass().addClass('password-meter-bar')
						.addClass('password-meter-' + rating.messageKey);
					meter.find('.password-meter-message').removeClass().addClass('password-meter-message')
						.addClass('password-meter-message-' + rating.messageKey)
						.text($.validator.passwordRating.messages[rating.messageKey]);
				}

				return (rating.messageKey === 'strong');
			}, "Your password does not meet the required criteria.");

			$.validator.addMethod('confirm-password', function(value, element) {
				return value == self.$el.find('#password').val();
			}, "Please retype your password.");

			// add numeric only validation rule
			//
			$.validator.addMethod('numericOnly', function (value) { 
				return (/^[0-9]+$/.test(value));
			}, 'Please only enter numeric values (0-9).');

			// add alpha only validation rule
			//
			$.validator.addMethod('alphaOnly', function (value) { 
				return (/^[-\sa-zA-Z]+$/.test(value));
			}, 'Please only enter alpha values ( letters, hyphens, and spaces ).');


			// add numeric or dashes only validation rule (for phone numbers)
			//
			$.validator.addMethod('numericOrDashesOnly', function (value) { 
				return (/^[0-9,-]+$/.test(value));
			}, 'Please only enter numeric values (0-9).');
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				classes: this.options.classes
			};
		},

		onRender: function() {

			// show subviews
			//
			//this.showCountrySelector();

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// validate form
			//
			this.validator = this.validate();
		},

		showCountrySelector: function() {

			// show country selector
			//
			this.showChildView('selector', new CountrySelectorView({
				initialValue: this.model.has('address')? this.model.get('address').get('country') : undefined
			}));

			// add country selector callback
			//
			var self = this;
			this.getChildView('selector').onclickmenuitem = this.getChildView('selector').onrender = function() {
				var country = self.getChildView('selector').getSelected();
				var countryCode = country.get('phone_code');

				// set default phone code
				//
				self.model.get('phone').set({
					'country-code': countryCode
				});
				self.$el.find('#country-code').val(countryCode);
			};
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.validate({

				// validation classes
				//
				ignore: ".ignore",
				rules: this.rules,
				messages: this.messages
			});
		},

		//
		// form methods
		//

		getValues: function() {

			// get values from form
			//
			var firstName = this.$el.find('#first-name').val();
			var lastName = this.$el.find('#last-name').val();
			var promo = this.$el.find('#promo-code').val();
			var email = this.$el.find('#email').val();
			var username = this.$el.find('#username').val();
			var password = this.$el.find('#password').val();
			var classCode = this.$el.find('#class-code').val();
			
			// return form values
			//
			return {
				'first_name': firstName,
				'last_name': lastName,
				'promo': promo,
				'email': email,
				'username': username,
				'password': password,
				'class_code': classCode != 'none'? classCode : null
			};
		},

		//
		// username generation methods
		//

		getCombinedUsername: function() {

			// propose a username by combining first and last name
			//
			var firstName = this.$el.find('#first-name').val();
			var lastName = this.$el.find('#last-name').val();
			if (firstName && lastName) {
				return firstName.toLowerCase() + '.' + lastName.toLowerCase();
			}
		},

		getRandomUsername: function() {

			// propose a username by appending a 5 digit random number to 'swamp'
			//
			return 'swamp' + Math.round(10000 + Math.random() * 90000);
		},

		getHashedUsername: function() {

			// propose a username by hashing first, last name
			//
			var shaObj = new jsSHA(firstName + lastName, 'TEXT');
			var hash = shaObj.getHash('SHA-512', 'HEX');
			return 'swamp' + hash.substring(0, 5);		
		},

		//
		// event handling methods
		//


		onChangeUsername: function(event) {
			var self = this;
			var element = $(event.currentTarget);
			var username = event.currentTarget.value;
			if (username !== '' && username !== ' ') {

				// check for username uniqueness
				//
				var response = this.model.checkValidation({
						'username': username
					}, {

					// callbacks
					//
					success: function() {

						// clear error
						//
						element.closest('.form-group').removeClass('error');

						// enable validation on field
						//
						element.removeClass('ignore');
						
						// revalidate form
						//
						self.validator.resetForm();
						self.validator.reset();
					},

					// callbacks
					//
					error: function() {
						var error = JSON.parse(response.responseText)[0];
						error = error.substr(0,1).toUpperCase() + error.substr(1);
						element.closest('.form-group').removeClass('success').addClass('error');
						element.closest('.form-group').find('.error').removeClass('valid');
						element.closest('.form-group').find('label.error').html(error);

						// disable validation on field
						//
						element.addClass('ignore');
					}
				});
			}
		},

		onChangePromoCode: function(event) {
			var self = this;
			var element = $(event.currentTarget);
			var promo = event.currentTarget.value;
			if (promo !== '' && promo !== ' ') {

				// check for username uniqueness
				//
				var response = this.model.checkValidation({
						'promo': promo
					}, {

					// callbacks
					//
					success: function() {

						// clear error
						//
						element.closest('.form-group').removeClass('error');

						// enable validation on field
						//
						element.removeClass('ignore');
						
						// revalidate form
						//
						self.validator.resetForm();
						self.validator.reset();
					},

					error: function() {
						var error = JSON.parse(response.responseText)[0];
						error = error.substr(0,1).toUpperCase() + error.substr(1);
						element.closest('.form-group').removeClass('success').addClass('error');
						element.closest('.form-group').find('.error').removeClass('valid');
						element.closest('.form-group').find('label.error').html(error);

						// disable validation on field
						//
						element.addClass('ignore');
					}
				});
			}
		},

		onChangeEmail: function(event) {
			var self = this;
			var element = $(event.currentTarget);
			var email = event.currentTarget.value;
			var promo = this.$el.find('#promo-code').val();
			if (email !== '' && email !== ' ') {

				// check for username uniqueness
				//
				var response = this.model.checkValidation({
						'email': email,
						'email-verification': 'true',
						'user_external_id': this.model.get('user_external_id'),
						'promo': promo
					}, {

					// callbacks
					//
					success: function() {

						// clear error
						//
						element.closest('.form-group').removeClass('error');

						// enable validation on field
						//
						element.removeClass('ignore');
						
						// revalidate form
						//
						self.validator.resetForm();
						self.validator.reset();
					},

					error: function() {
						var error = JSON.parse(response.responseText)[0];
						error = error.substr(0,1).toUpperCase() + error.substr(1);
						element.closest('.form-group').removeClass('success').addClass('error');
						element.closest('.form-group').find('.error').removeClass('valid');
						element.closest('.form-group').find('label.error').html(error);

						// disable validation on field
						//
						element.addClass('ignore');
					}
				});
			}
		},

		onChangeClassCode: function() {

			// hide / show alert info
			//
			var classCode = this.$el.find('#class-code').val();
			if (classCode != 'none') {
				this.$el.find('.alert-info').show();
			} else {
				this.$el.find('.alert-info').hide();
			}
		}
	});
});
