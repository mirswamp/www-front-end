/******************************************************************************\
|                                                                              |
|                          version-filter-selector-view.js                     |
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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/widgets/selectors/version-filter-selector.tpl',
	'utilities/scripting/string-utils',
	'views/widgets/selectors/version-selector-view'
], function($, _, Template, StringUtils, VersionSelectorView) {
	return VersionSelectorView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// constructor
		//

		initialize: function(options) {
			this.options = options;
			this.collection.sort({
				reverse: true
			});
		},

		//
		// methods
		//

		reset: function(options) {

			// call superclass method
			//
			VersionSelectorView.prototype.reset.call(this);

			// hide form group
			//
			this.$el.closest('.form-group').hide();

			// update
			//
			this.onChange(options);
		},

		deselect: function(options) {
			this.setSelectedName('any', options);
		},
		
		//
		// rendering methods
		//

		templateContext: function() {
			var initialValue;

			// get initial value from options
			//
			if (this.options.initialValue) {
				if (typeof(this.options.initialValue) == 'string') {
					initialValue = this.options.initialValue.toTitleCase();
				} else {
					initialValue = this.options.initialValue.get('version_string');
				}
			}

			return {
				selected: initialValue,
				defaultOptions: this.options.defaultOptions
			};
		},

		//
		// querying methods
		//

		getSelected: function() {
			var selectedIndex = this.getSelectedIndex();

			if (selectedIndex < this.options.defaultOptions.length) {

				// return default values
				//
				return this.options.selectedOptions[selectedIndex];
			} else {

				// return package version
				//
				return this.collection.at(selectedIndex - this.options.defaultOptions.length);		
			}
		},

		hasSelected: function() {
			var selected = this.getSelected();
			return (selected !== null) && (selected != 'any');
		},

		getSelectedVersionString: function() {
			return this.constructor.getVersionString(this.getSelected());
		},

		onChange: function(options) {

			// perform callback
			//
			if (this.options && this.options.onChange) {
				if (!options || !options.silent) {
					this.options.onChange({
						'version': this.getSelected()
					});
				}
			}
		}
	}, {

		//
		// static methods
		//

		getVersionString: function(version) {
			if (typeof version == 'string') {
				return version + ' version';
			} else if (typeof version == 'object') {
				return 'version ' + version.get('version_string');
			}
		}
	});
});