/******************************************************************************\
|                                                                              |
|                        new-contact-profile-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering new contact profile info.            |
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
	'text!templates/contacts/contact-profile/new-contact-profile-form.tpl',
	'widgets/accordions',
	'models/contacts/contact',
	'views/forms/form-view'
], function($, _, Template, Accordions, Contact, FormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// form attributes
		//
		
		messages: {
			'first-name': {
				required: "Enter your given / first name"
			},
			'last-name': {
				required: "Enter your family / last name"
			}
		},

		//
		// constructor
		//

		initialize: function() {
			this.model = new Contact();
			
			// set contact to current user
			//
			if (application.session.user) {
				this.model.setUser(application.session.user);
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

		templateContext: function() {
			return {
				collapsed: this.model.has('email')
			};
		},

		onRender: function() {

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
		},

		//
		// form methods
		//

		getValues: function() {
			return {
				'first_name': this.$el.find('#first-name').val(),
				'last_name': this.$el.find('#last-name').val(),
				'email': this.$el.find('#email').val(),
				'subject': this.$el.find('#subject').val(),
				'question': this.$el.find('#question').val()
			};
		}
	});
});
