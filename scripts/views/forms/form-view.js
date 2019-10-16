/******************************************************************************\
|                                                                              |
|                                 form-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract base class for form views.                   |
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
	'bootstrap/popover',
	'views/base-view',
	'utilities/web/browser',
	'jquery.validate.bootstrap'
], function($, _, Popover, BaseView, Browser) {
	'use strict';

	return BaseView.extend({

		//
		// attributes
		//

		tagName: 'form',
		className: 'form-horizontal',

		events: {

			// input events
			//
			'change input': 'onChange',
			'change textarea': 'onChange',
			'change select': 'onChange'
		},

		focusable: 'input:visible, textarea:visible, select:visible',

		// prevent default form submission
		//
		attributes: {
			'onsubmit': 'return false'
		},

		// popovers
		//
		popover_container: '.modal',
		popover_trigger: 'hover',
		popover_placement: 'top',

		//
		// constructor
		//

		initialize: function() {

			// set attributes
			//
			if (this.options.focusable !== undefined) {
				this.focusable = this.options.focuable;
			}
			if (this.options.focused == undefined) {
				this.options.focused = true;
			}
		},

		//
		// focusing methods
		//

		focus: function() {
			if (this.focusable) {

				// find first element to focus on
				//
				var element = this.$el.find(this.focusable).first();
				if (element) {
					element.focus();
				}
			}
		},

		//
		// rendering methods
		//

		onRender: function() {

			// create form validator
			//
			this.validate();
		},

		onAttach: function() {
			if (this.options.focused && !Browser.isTouchEnabled()) {
				this.focus();
			}

			// add popover triggers
			//
			this.addPopovers();
		},

		//
		// form validation methods
		//

		validate: function() {
			this.validator = this.$el.validate({
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
		// form submission methods
		//

		applyTo: function(model) {

			// check form validation
			//
			if (!this.isValid()) {
				return false;
			} else {

				// set model attributes
				//
				return model.set(this.getValues());
			}
		},
		
		submit: function(options) {

			// check form validation
			//
			if (!this.isValid()) {
				return false;
			} else {

				// save model
				//
				return this.model.save(this.getValues(), options);
			}
		},

		submitAs: function(model, options) {

			// check form validation
			//
			if (!this.isValid()) {
				return false;
			} else {

				// save model
				//
				return model.save(this.getValues(), options);
			}
		},

		//
		// popover methods
		//

		addPopovers: function(options) {

			// show popovers on trigger
			//
			this.$el.find('[data-toggle="popover"]').addClass('popover-trigger').popover(_.extend({
				container: this.$el.closest(this.popover_container)[0] || this.el.closest('#page'),
				trigger: this.popover_trigger,
				placement: this.popover_placement
			}, options));
		},

		removePopovers: function(options) {
			if (options && options.container) {
				$(options.container).find('.popover').remove();
			} else {
				this.$el.find('.popover').remove();
			}
		},

		//
		// event handling methods
		//

		onChange: function() {

			// perform callback
			//
			if (this.options.onValidate) {
				this.options.onValidate(this.isValid());
			}
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			this.removePopovers();
		}
	});
});
