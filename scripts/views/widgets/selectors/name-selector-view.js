/******************************************************************************\
|                                                                              |
|                               name-selector-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting an item from a list of names.       |
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
	'dropdown',
	'text!templates/widgets/selectors/name-selector.tpl'
], function($, _, Backbone, Marionette, Dropdown, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'change': 'onChange',
			'click .dropdown-menu li': 'onClickMenuItem'
		},

		//
		// methods
		//

		initialize: function() {

			// set initial value
			//
			this.selected = this.options.initialValue;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				selected: this.selected
			}));
		},

		onRender: function() {

			// apply select2 selector
			//
			/*
			this.selector = $(this.$el.find("select").select2({
				width: '100%'
			}));
			*/
		},

		//
		// querying methods
		//

		getSelectedIndex: function() {
			return this.$el.find('select')[0].selectedIndex;
		},

		getSelected: function() {
			return this.selected;
		},

		getSelectedName: function() {
			if (!this.selected) {
				return '';
			} else if (typeof this.selected == 'string') {
				return this.selected;
			} else if (typeof this.selected == 'object') {
				return this.selected.get('name');
			}
			// return this.selected? this.selected.get('name') : '';
		},

		hasSelected: function() {
			return this.getSelected() !== undefined;
		},

		getItemByIndex: function(index) {
			return this.collection.at(index);
		},

		getOptionByName: function(name) {
			var options = this.$el.find('select')[0].options;
			for (var i = 0; i < options.length; i++) {
				if (options[i].value == name) {
					return i;
				}
			}
		},

		//
		// setting methods
		//

		setSelectedName: function(selectedName, options) {
			this.setSelectedIndex(this.getOptionByName(selectedName), options);

			// update
			//
			this.onChange(options);
		},

		setSelectedIndex: function(index, options) {
			this.$el.find('select')[0].selectedIndex = index;

			// update
			//
			this.onChange(options);
		},

		deselect: function(options) {
			this.$el.find('select')[0].selectedIndex = -1;

			// update
			//
			this.onChange(options);
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// set value
			//
			this.selected = this.getItemByIndex(this.getSelectedIndex());

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange();
			}
		},

		onClickMenuItem: function () {
			if (this.onclickmenuitem) {
				this.onclickmenuitem();
			}
		}
	});
});