/******************************************************************************\
|                                                                              |
|                             user-name-filter-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a user name filter.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/collapse',
	'text!templates/users/filters/user-name-filter.tpl',
	'utilities/web/url-strings',
	'views/base-view'
], function($, _, Collapse, Template, UrlStrings, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'search input': 'onChange',
			'keydown': 'onKeyDown'
		},

		//
		// querying methods
		//

		tagify: function(text) {
			return '<span class="tag' + (this.hasValue()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#user-name-filter">' + 
				'<i class="fa fa-font"></i>' + text + '</span>';
		},

		getTag: function() {
			return this.tagify(this.getValue());
		},

		hasValue: function() {
			return this.$el.find('input').val() != '';
		},

		getValue: function() {
			return this.$el.find('input').val();
		},

		getData: function() {
			if (this.hasValue()) {
				return {
					name: this.getValue()
				};
			}
		},

		getAttrs: function() {
			return this.getData();
		},

		getQueryString: function() {
			var queryString = '';

			if (this.hasValue()) {
				queryString += 'name=' + urlEncode(this.getValue());
			}

			return queryString;
		},

		//
		// setting methods
		//

		reset: function(options) {
			this.$el.find('input').val('');
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange();
			}
		},

		onKeyDown: function(event) {

			// check for return key
			//
			if (event.keyCode == 13) {
				this.onChange();
			}
		}
	});
});