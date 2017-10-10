/******************************************************************************\
|                                                                              |
|                         android-source-package-form-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a package versions's            |
|        language / type specific profile information.                         |
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
	'bootstrap/collapse',
	'bootstrap/dropdown',
	'bootstrap/tooltip',
	'bootstrap/popover',
	'bootstrap.select',
	'jquery.validate',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/android-bytecode/android-bytecode-package-form.tpl',
	'registry',
	'widgets/accordions'
], function($, _, Backbone, Marionette, Collapse, Dropdown, Tooltip, Popover, Select, Validate, Template, Registry, Accordions) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		buildCommands: {
			'android-apk': 	'apk'
		},

		//
		// setting methods
		//

		setBuildSystem: function(buildSystem) {

			// set selector
			//
			switch (buildSystem) {
				case 'android-apk':
					this.$el.find("#build-system").val('android-apk');
					break;
			}
		},

		//
		// querying methods
		//

		getBuildSystem: function() {
			switch (this.$el.find('#build-system').val()) {
				case 'android-apk':
					return 'android-apk';
					break;
			}
		},

		getBuildSystemName: function(buildSystem) {
			switch (buildSystem) {
				case 'android-apk':
					return 'Android APK';
					break;
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));

			// check build system of package version
			//
			this.options.parent.checkBuildSystem();

			// hide build script
			//
			this.options.parent.options.parent.hideBuildScript();

			// validate the form
			//
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({

				// don't ignore hidden fields
				//
				ignore: [],

				rules: {
					'build-system': {
						buildSystemRequired: true
					}
				}
			});
		},

		isValid: function() {
			//return this.validator.form();
			return true;
		},

		//
		// form methods
		//

		update: function(model) {

			// build system settings
			//
			var buildSystem = this.getBuildSystem();

			// set model attributes
			//
			model.set({

				// build system attributes
				//
				'build_system': buildSystem != ''? buildSystem : null
			});
		}
	});
});
