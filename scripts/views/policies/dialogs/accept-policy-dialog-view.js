/******************************************************************************\
|                                                                              |
|                         accept-policy-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is used to accept a policy.            |
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
	'text!templates/policies/dialogs/accept-policy-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Template, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click input': 'onClickInput',
			'click #ok': 'onClickOk',
			'click #cancel': 'onClickCancel'
		},

		//
		// form attributes
		//

		rules: {
			'accept': {
				required: true
			}
		},

		messages: {
			'accept': {
				required: "You must accept the terms to continue."
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.options.title,
				message: this.options.message,
				policy: this.options.policy
			};
		},

		onRender: function() {

			// scroll to top
			//
			var el = this.$el.find('h1');
			el[0].scrollIntoView(true);
		},

		//
		// form validation methods
		//

		validate: function() {

			// validate form
			//
			this.validator = $(this.$el.find('#aup-form')[0]).validate({
				rules: this.rules,
				messages: this.messages
			});
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

				// perform callback
				//
				if (this.options.accept) {
					this.options.accept();
				}
			} else {

				// prevent further handling of event
				//
				event.stopPropagation();
				event.preventDefault();
			}
		},

		onClickCancel: function(event) {

			// perform callback
			//
			if (this.options.reject) {
				this.options.reject();
			}		
		}
	});
});
