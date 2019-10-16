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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/dropdown',
	'text!templates/widgets/selectors/name-selector.tpl',
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
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				selected: this.selected
			};
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

		reset: function() {
			this.setSelectedIndex(undefined);
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