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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'dropdown',
	'text!templates/widgets/selectors/version-selector.tpl',
	'views/widgets/selectors/name-selector-view'
], function($, _, Backbone, Marionette, Dropdown, Template, NameSelectorView) {
	return NameSelectorView.extend({
		
		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				selected: this.options.initialValue? this.options.initialValue.get('version_string') : undefined
			}));
		},

		//
		// methods
		//

		onChange: function(){

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
			return this.getSelected() !== null;
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
