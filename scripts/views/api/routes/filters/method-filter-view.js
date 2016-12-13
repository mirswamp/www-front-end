/******************************************************************************\
|                                                                              |
|                                method-filter-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing an api route method filter.         |
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
	'collapse',
	'modernizr',
	'text!templates/api/routes/filters/method-filter.tpl',
	'utilities/browser/url-strings',
	'views/api/routes/selectors/method-selector-view',
], function($, _, Backbone, Marionette, Collapse, Modernizr, Template, UrlStrings, MethodSelectorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			methodSelector: '.method-selector',
		},

		events: {
			'click #reset': 'onClickReset'
		},

		//
		// methods
		//

		initialize: function() {
			this.selected = this.options.initialValue;
		},

		//
		// querying methods
		//

		hasSelected: function() {
			return this.methodSelector.currentView.hasSelected() && this.methodSelector.currentView.getSelectedName() != 'Any';
		},

		getSelected: function() {
			return this.selected;
		},

		getDescription: function() {
			if (this.hasSelected()) {
				var name = this.methodSelector.currentView.getSelectedName();
				if (name != 'Any') {
					return name;
				} else {
					return "any method";
				}
			} else {
				return "any method";		
			}
		},

		tagify: function(text) {
			return '<span class="tag' + (this.hasSelected()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#method-filter">' + 
				'<i class="fa fa-caret-square-o-right"></i>' + text + '</span>';
		},

		getTag: function() {
			return this.tagify(this.getDescription());
		},

		getData: function() {
			if (this.hasSelected()) {
				var name = this.methodSelector.currentView.getSelectedName();
				if (name != 'Any') {
					return {
						'method': name
					};
				}
			} else {
				if (this.options.initialValue) {
					return {
						'method': this.options.initialValue
					}
				}	
			}
		},

		getAttrs: function() {
			return this.getData();
		},

		getQueryString: function() {
			var queryString = '';

			if (this.hasSelected()) {
				queryString += 'method=' + urlEncode(this.methodSelector.currentView.getSelectedName().toLowerCase());
			}

			return queryString;
		},

		//
		// setting methods
		//

		reset: function(options) {
			this.methodSelector.currentView.setSelectedName("Any", {
				silent: true
			});
			this.onChange(options);
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {
			var self = this;

			// show subviews
			//
			this.methodSelector.show(
				new MethodSelectorView({
					initialValue: this.options.initialValue,

					// callbacks
					//
					onChange: function() {
						self.onChange();
					}
				})
			);

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
			this.selected = this.methodSelector.currentView.getSelectedName();

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