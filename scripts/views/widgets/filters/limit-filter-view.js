/******************************************************************************\
|                                                                              |
|                               limit-filter-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a limit filter.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'jquery.validate',
	'bootstrap/collapse',
	'modernizr',
	'text!templates/widgets/filters/limit-filter.tpl'
], function($, _, Backbone, Marionette, Validate, Collapse, Modernizr, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'blur #limit': 'onBlurLimit',
			'keyup #limit': 'onKeyUpLimit',
			'click #reset': 'onClickReset'
		},

		//
		// methods
		//

		initialize: function() {

			// add custom validation method
			//
			$.validator.addMethod('positiveNumber', function (value) { 
				return value == '' || ($.isNumeric(value) && Number(value) > 0);
			}, 'Please enter a positive number.');
		},

		//
		// querying methods
		//

		isSet: function() {
			return this.getLimit() != this.options.defaultValue;
		},

		hasLimit: function() {		
			return this.getLimit() !== null;
		},

		getLimit: function() {
			var limit = this.$el.find('input').val();
			if (limit != '') {
				return parseInt(limit);
			} else {
				return null;
			}
		},

		getInitialValue: function() {
			if (typeof(this.options.initialValue) == 'number') {
				return this.options.initialValue;
			} else if (this.options.initialValue === undefined) {
				return this.options.defaultValue;
			} else {
				return null;
			}
		},

		getDescription: function() {
			if (this.hasLimit()) {
				return this.getLimit() + " items";
			} else {
				return "all items";
			}
		},

		tagify: function(text) {
			return '<span class="tag' + (this.hasLimit()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#limit-filter">' + 
				'<i class="fa fa-caret-left"></i>' + text + '</span>';
		},

		getTag: function() {
			return this.tagify(this.getDescription());
		},

		getData: function() {
			var data = {};

			if (this.hasLimit()) {
				data.limit = this.getLimit();
			}

			return data;
		},

		getAttrs: function() {
			return this.getData();
		},

		getQueryString: function() {
			var queryString = '';

			if (this.isSet()) {
				if (this.hasLimit()) {
					queryString = 'limit=' + this.getLimit();
				} else {
					queryString = 'limit=none';
				}
			}

			return queryString;
		},

		//
		// setting methods
		//

		setLimit: function(value) {
			return this.$el.find('input').val(value);
		},

		reset: function(options) {

			// reset sub filters
			//
			this.setLimit(this.options.defaultValue, options);
			this.hideReset();
			
			// update
			//
			this.onChange(options);
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				limit: this.getInitialValue()
			}));
		},

		onRender: function() {

			// validate the form
			//
			this.validator = this.validate();

			// update reset button
			//
			this.updateReset();
		},

		//
		// reset button related methods
		//

		showReset: function() {
			this.$el.find('#reset').show();
		},

		hideReset: function() {
			this.$el.find('#reset').hide();
		},

		updateReset: function() {
			if (this.isSet()) {
				this.showReset();
			} else {
				this.hideReset();
			}
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({
				rules: {
					'filter-number': {
						positiveNumber: true
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// update reset button
			//
			this.updateReset();

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange({
					limit: this.getLimit()
				});
			}		
		},

		onBlurLimit: function() {
			this.onChange();
		},

		onKeyUpLimit: function(event) {

			// detect return key up event
			//
			if (event.keyCode == 13) {
				this.onChange();
			}
		},

		onClickReset: function() {
			this.reset();
			this.onChange();
		}
	});
});
