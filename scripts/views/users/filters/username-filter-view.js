/******************************************************************************\
|                                                                              |
|                             username-filter-view.js                          |
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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/collapse',
	'text!templates/users/filters/username-filter.tpl',
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
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#username-filter">' + 
				'<i class="fa fa-laptop"></i>' + text + '</span>';
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
					username: this.getValue()
				};
			}
		},

		getAttrs: function() {
			return this.getData();
		},

		getQueryString: function() {
			var queryString = '';

			if (this.hasValue()) {
				queryString += 'username=' + urlEncode(this.getValue());
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