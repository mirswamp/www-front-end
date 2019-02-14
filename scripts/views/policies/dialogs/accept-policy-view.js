/******************************************************************************\
|                                                                              |
|                               accept-policy-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that is used to show a modal accept policy        |
|        dialog box.                                                           |
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
	'text!templates/policies/dialogs/accept-policy.tpl',
	'registry'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click input': 'onClickInput',
			'click #ok': 'onClickOk',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: this.options.title,
				message: this.options.message,
				policy: this.options.policy
			});
		},

		onRender: function() {

			// validate form
			//
			this.validator = this.validate();

			// scroll to top
			//
			var el = this.$el.find('h1');
			el[0].scrollIntoView(true);
		},

		//
		// form validation methods
		//

		validate: function() {
			var form = this.$el.find('#aup-form')[0];

			// validate form
			//
			if (form.validate) {
				return form.validate({
					rules: {
						'accept': {
							required: true
						}
					},
					messages: {
						'accept': {
							required: "You must accept the terms to continue."
						}
					}
				});
			}
		},

		isValid: function() {
			if (this.validator) {
				return this.validator.form();
			} else {
				return true;
			}
		},

		//
		// event handling methods
		//


		onClickInput: function(event) {
			if ($(event.target).prop('checked')) {

				// enable save button
				//
				this.$el.find('#ok').prop('disabled', false);
			} else {

				// disable save button
				//
				this.$el.find('#ok').prop('disabled', true);
			}
		},

		onClickOk: function(event) {
			if (this.isValid()) {
				if (this.options.accept) {
					this.options.accept();
				}
			} else {
				event.stopPropagation();
			}
		},

		onClickCancel: function(event) {
			if (this.options.reject) {
				this.options.reject();
			}		
		}
	});
});
