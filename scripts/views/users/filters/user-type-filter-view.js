/******************************************************************************\
|                                                                              |
|                             user-type-filter-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a user type filter.                 |
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
	'bootstrap/collapse',
	'text!templates/users/filters/user-type-filter.tpl',
	'utilities/web/url-strings',
	'views/base-view',
	'views/users/selectors/user-type-selector-view',
], function($, _, Collapse, Template, UrlStrings, BaseView, UserTypeSelectorView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		
		regions: {
			selector: '.user-type-selector',
		},

		events: {
			'click #reset': 'onClickReset'
		},

		//
		// constructor
		//

		initialize: function() {
			this.selected = this.options.initialValue;
		},

		//
		// querying methods
		//

		hasSelected: function() {
			var selected = this.getSelected();
			if (selected && selected != 'Any') {
				if (typeof(selected) == 'string') {
					return true;
				} else {
					return selected.get('name') != 'Any';
				}
			} else {
				return false;
			}
		},

		getSelected: function() {
			return this.selected;
		},

		getDescription: function() {
			if (this.hasSelected()) {
				var name = this.getChildView('selector').getSelectedName().toLowerCase();
				if (name != 'Any') {
					return name;
				} else {
					return "any type";
				}
			} else {
				if (this.options.initialValue) {
					return this.options.initialValue;
				} else {
					return "any type";
				}			
			}
		},

		tagify: function(text) {
			return '<span class="tag' + (this.hasSelected()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#user-type-filter">' + 
				'<i class="fa fa-group"></i>' + text + '</span>';
		},

		getTag: function() {
			return this.tagify(this.getDescription());
		},

		getData: function() {
			if (this.hasSelected()) {
				var name = this.getChildView('selector').getSelectedValue();
				if (name != 'Any') {
					return {
						type: name
					};
				}
			} else {
				if (this.options.initialValue) {
					return {
						type: this.options.initialValue
					};
				}	
			}
		},

		getAttrs: function() {
			return this.getData();
		},

		getQueryString: function() {
			var queryString = '';

			if (this.hasSelected()) {
				queryString += 'type=' + urlEncode(this.getChildView('selector').getSelectedValue());
			}

			return queryString;
		},

		//
		// setting methods
		//

		reset: function(options) {
			this.getChildView('selector').setSelectedName("Any", options);
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// show subviews
			//
			this.showChildView('selector', new UserTypeSelectorView({
				initialValue: this.options.initialValue,

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));

			// update reset button
			//
			if (this.options.initialValue && this.options.initialValue != 'Any') {
				this.showReset();	
			} else {
				this.hideReset();
			}
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
			if (this.hasSelected()) {
				this.showReset();
			} else {
				this.hideReset();
			}
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// update selected
			//
			this.selected = this.getChildView('selector').getSelectedName();

			// update reset button
			//
			this.updateReset();

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange();
			}
		},

		onClickReset: function() {
			this.reset();
		}
	});
});