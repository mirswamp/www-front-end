/******************************************************************************\
|                                                                              |
|                            event-type-filter-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing an event type filter.               |
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
	'text!templates/users/accounts/events/filters/event-type-filter.tpl',
	'views/base-view',
	'views/widgets/selectors/named-selector-view',
	'views/base-view',
	'utilities/web/url-strings'
], function($, _, Collapse, Template, BaseView, NamedSelectorView, UrlStrings) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			selector: '.event-type-selector',
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
			return selected && selected != 'any' && selected != 'Any';
		},

		getSelected: function() {
			return this.selected;
		},

		getDescription: function() {
			if (this.hasSelected()) {
				return this.getChildView('selector').getSelectedName().toLowerCase();
			} else {
				return "any type";			
			}
		},

		tagify: function(text) {
			return '<span class="tag' + (this.hasSelected()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#event-type-filter">' + 
				'<i class="fa fa-bullhorn"></i>' + text + '</span>';
		},

		getTag: function() {
			return this.tagify(this.getDescription());
		},

		getData: function() {
			if (this.hasSelected()) {
				var selected = this.getChildView('selector').getSelected();
				return {
					type: selected.get('value')
				};
			} else {
				return {
					type: undefined
				};
			}
		},

		getAttrs: function() {
			return this.getData();
		},

		getQueryString: function() {
			var queryString = '';

			if (this.hasSelected()) {
				queryString += 'type=' + urlEncode(this.getChildView('selector').getSelected().get('value'));
			}

			return queryString;
		},

		//
		// setting methods
		//

		reset: function(options) {
			this.selected = undefined;
			this.getChildView('selector').setSelectedName("Any", options);
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;
			var eventTypes = new Backbone.Collection([
				new Backbone.Model({
					name: 'Any',
					value: 'any'
				}),
				new Backbone.Model({
					name: 'User Events',
					value: 'user'
				}),
				new Backbone.Model({
					name: 'Project Events',
					value: 'project'
				})
			]);

			// show subviews
			//
			this.showChildView('selector', new NamedSelectorView({
				collection: eventTypes,
				defaultValue: 'Any',
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

		onChange: function() {

			// update selected
			//
			this.selected = this.getChildView('selector').getSelectedName();

			// update reset button
			//
			this.updateReset();

			// call on change callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onClickReset: function() {
			this.reset();
		}
	});
});