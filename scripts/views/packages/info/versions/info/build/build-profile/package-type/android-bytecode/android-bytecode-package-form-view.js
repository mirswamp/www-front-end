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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/android-bytecode/android-bytecode-package-form.tpl',
	'widgets/accordions',
	'views/packages/info/versions/info/build/build-profile/package-type/package-type-form-view'
], function($, _, Backbone, Marionette, Template, Accordions, PackageTypeFormView) {
	return PackageTypeFormView.extend({

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
		// form methods
		//

		getValues: function() {
			return {
				'build_system': this.getBuildSystem()
			};
		}
	});
});
