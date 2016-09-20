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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
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
			'click #ok': 'onClickOk',
			'keypress': 'onKeyPress'
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

		onClickOk: function(event) {
			if (this.isValid()) {
				if (this.options.accept) {
					this.options.accept();
				}
			} else {
				event.stopPropagation();
			}
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
	        if (event.keyCode === 13) {
	            this.onClickOk();
	            Registry.application.modal.hide();
	        }
		}
	});
});
