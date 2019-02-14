/******************************************************************************\
|                                                                              |
|                         package-dependency-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for creating new package dependencies.            |
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
	'backbone',
	'marionette',
	'jquery.validate',
	'bootstrap/popover',
	'text!templates/packages/info/versions/info/build/dependencies/editable-list/forms/package-dependency-form.tpl',
	'views/dialogs/error-view',
	'views/platforms/selectors/platform-selector-view',
], function($, _, Backbone, Marionette, Validate, Popover, Template, ErrorView, PlatformSelectorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			platformSelector: '#platform-selector',
			platformVersionSelector: '#platform-version-selector'
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;

			// create subviews
			//
			this.platformSelectorView = new PlatformSelectorView([], {
				versionSelector: this.platformVersionSelector,
				allowLatest: false,
				platformVersionFilter: this.options.platformVersionFilter,

				// callbacks
				//
				onChange: function(source) {
					self.onChange();
				}
			});
		},

		//
		// rendering methods
		//

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// show subviews
			//
			this.platformSelector.show(this.platformSelectorView);

			// validate the form
			//
			this.validator = this.validate();
		},

		//
		// form methods
		//

		update: function(model) {

			// get form values
			//
			var dependencyList = this.$el.find('#dependency-list input').val();
			var platformVersion = this.platformVersionSelector.currentView.getSelected();

			// set model attributes
			//
			this.model.set({
				'platform_version_uuid': platformVersion.get('platform_version_uuid'),
				'dependency_list': dependencyList
			});
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate();
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// event handling methods
		//

		onChange: function() {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		}
	});
});
