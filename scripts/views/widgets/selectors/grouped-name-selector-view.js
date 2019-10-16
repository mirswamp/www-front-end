/******************************************************************************\
|                                                                              |
|                            grouped-name-selector-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting an item from a list of names        |
|        organized into a series of groups.                                    |
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
	'select2',
	'text!templates/widgets/selectors/grouped-name-selector.tpl',
	'views/base-view'
], function($, _, Dropdown, Select2, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		tagName: 'select',
		className: 'selectpicker',
		template: _.template(Template),

		events: {
			'change': 'onChange',
			'click .dropdown-menu li': 'onClickMenuItem'
		},

		//
		// constructor
		//

		initialize: function(options) {
			if (options) {

				// set initial value
				//
				this.selected = this.options.initialValue;
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

		onRender: function() {

			// apply select2 selector
			//
			this.selector = this.$el.select2({
				dropdownAutoWidth: 'true'
			});
		},

		//
		// setting methods
		//

		setSelectedName: function(selectedName, options) {
			this.$el.select2('val', selectedName);

			// update
			//
			this.onChange(options);
		},

		deselect: function(options) {
			this.selected = null;
			this.$el.select2('val', null);

			// update
			//
			this.onChange(options);
		},

		reset: function(options) {
			this.selected = undefined;
			this.clear();

			// update
			//
			this.onChange(options);
		},

		clear: function() {
			if (this.selector) {
				this.selector.find('option').remove();
			}
		},

		//
		// querying methods
		//

		hasSelected: function() {
			return this.getSelected() != undefined;
		},

		getSelected: function() {
			return this.selected;
		},

		getSelectedName: function() {
			return this.el.value;
		},

		getSelectedIndex: function() {
			return this.el.selectedIndex;
		},

		getItemByIndex: function(index) {

			// search collections of names
			//
			var items = 0;
			for (var i = 0; i < this.collection.length; i++) {
				if (!this.collection.at(i).has('group')) {

					// select individual items
					//
					if (index === i) {
						return this.collection.at(i).get('model');
					} else {
						items++;
					}
				} else {
					var collectionIndex = i - items;

					// select items in groups
					//
					var group = this.collection.at(i).get('group');
					var offset = index - items;
					if (offset < group.length) {
						return group.at(offset);
					} else {
						items += group.length;
					}
				}
			}
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// update selected
			//
			this.selected = this.getItemByIndex(this.getSelectedIndex());

			// perform callback
			//
			if (this.options.onChange && (!options || !options.silent)) {
				this.options.onChange();
			}
		},

		onClickMenuItem: function () {
			if (this.onclickmenuitem) {
				this.onclickmenuitem();
			}
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			// this.$el.find('select').select2('destroy');
		}
	});
});