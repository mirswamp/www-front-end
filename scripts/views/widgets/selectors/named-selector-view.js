/******************************************************************************\
|                                                                              |
|                               named-selector-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting an item from a list of named        |
|        objects / models.                                                     |
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
	'bootstrap/dropdown',
	'text!templates/widgets/selectors/named-selector.tpl',
	'views/base-view'
], function($, _, Dropdown, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'change': 'onChange',
			'click .dropdown-menu li': 'onClickMenuItem'
		},

		//
		// constructor
		//

		initialize: function() {

			// set initial value
			//
			this.selected = this.options.initialValue;

			// lookup initially selected value
			//
			if (this.selected) {
				if (this.selected.has('value')) {
					this.selected = this.getItemByValue(this.selected.get('value'));
				} else if (this.selected.has('name')) {
					this.selected = this.getItemByName(this.selected.get('name'));
				}
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				selected: this.selected
			};
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
			return this.selected? this.selected.get('name') : '';
		},

		hasSelected: function() {
			return this.getSelected() !== undefined;
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
		// collection querying methods
		//

		getItemByIndex: function(index) {
			return this.collection.at(index);
		},

		getItemByName: function(name) {
			for (var i = 0; i < this.collection.length; i++) {
				var item = this.collection.at(i);
				if (item.get('name') == name) {
					return item;
				}
			}
		},

		getItemByValue: function(value) {
			for (var i = 0; i < this.collection.length; i++) {
				var item = this.collection.at(i);
				if (item.get('value') == value) {
					return item;
				}
			}
		},

		//
		// setting methods
		//

		setSelectedName: function(selectedName, options) {
			this.setSelectedIndex(this.getOptionByName(selectedName));

			// update
			//
			this.onChange(options);
		},

		setSelectedIndex: function(index) {
			this.$el.find('select')[0].selectedIndex = index;
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