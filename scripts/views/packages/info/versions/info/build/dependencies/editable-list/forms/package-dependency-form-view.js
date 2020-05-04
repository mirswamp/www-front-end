/******************************************************************************\
|                                                                              |
|                       package-dependency-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering package dependency info.             |
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
	'text!templates/packages/info/versions/info/build/dependencies/editable-list/forms/package-dependency-form.tpl',
	'views/forms/form-view',
	'views/platforms/selectors/platform-selector-view',
], function($, _, Template, FormView, PlatformSelectorView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			selector: '#platform-selector',
			version_selector: '#platform-version-selector'
		},

		events: {

			// input events
			//
			'change select': 'onChange',
			'input input': 'onChange',
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;
			
			// show subviews
			//
			this.showChildView('selector', new PlatformSelectorView({
				versionSelectorRegion: this.getRegion('version_selector'),
				allowLatest: false,
				platformVersionFilter: this.options.platformVersionFilter,

				// callbacks
				//
				onChange: function(source) {
					self.onChange();
				}
			}));

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
		},

		//
		// form methods
		//

		getValue: function(key) {
			switch (key) {
				case 'platform_version_uuid':
					return this.getChildView('version_selector').getSelected().get('platform_version_uuid');
				case 'dependency_list':
					return this.$el.find('#dependency-list input').val();
			}
		},

		hasValue: function(key) {
			switch (key) {
				case 'platform_version_uuid':
					return this.getChildView('selector').hasSelected();
				case 'dependency_list':
					return this.getValue('dependency_list') != '';
			}
		},

		getValues: function() {
			return {
				'platform_version_uuid': this.getValue('platform_version_uuid'),
				'dependency_list': this.getValue('dependency_list')
			};
		},

		isValid: function() {
			return this.hasValue('platform_version_uuid') && this.hasValue('dependency_list');
		},

		//
		// event handling methods
		//

		onChange: function() {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange(this.isValid());
			}
		}
	});
});
