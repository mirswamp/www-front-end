/******************************************************************************\
|                                                                              |
|                              version-selector-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for selecting a version of something.           |
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
	'select2',
	'text!templates/widgets/selectors/version-selector.tpl',
	'views/widgets/selectors/name-selector-view'
], function($, _, Dropdown, Select2, Template, NameSelectorView) {
	return NameSelectorView.extend({
		
		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				selected: this.options.initialValue? this.options.initialValue.get('version_string') : undefined
			};
		},

		onRender: function() {

			// apply select2 selector
			//
			if (this.options.searchable) {
				this.$el.find('select').select2({
					dropdownAutoWidth: 'true'
				});
			}
		},

		//
		// methods
		//

		onChange: function() {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange(this.getSelected()? 'version-selected' : 'null-selected');
			}
		},

		getSelected: function() {
			var selectedIndex = this.getSelectedIndex();
			var selected = this.collection.at(selectedIndex);
			var latest = selected && selected.get('version_string') == 'Latest';
			return selected == '' || latest? false : selected;
		},

		hasSelected: function() {
			return this.getSelected() !== undefined;
		},

		getSelectedVersionString: function() {
			var selected = this.getSelected();
			if (selected) {
				return selected.get('version_string');
			} else {
				return 'any version';
			}
		}
	});
});
