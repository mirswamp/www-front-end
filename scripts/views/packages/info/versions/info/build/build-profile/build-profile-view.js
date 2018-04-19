/******************************************************************************\
|                                                                              |
|                               build-profile-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a non-editable form view of a package versions's         |
|        build information.                                                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'collections/platforms/platform-versions',
	'text!templates/packages/info/versions/info/build/build-profile/build-profile.tpl',
	'widgets/accordions',
	'views/packages/info/versions/info/build/dependencies/list/package-dependencies-list-view',
	'views/packages/info/versions/info/build/build-profile/package-type/c/c-package-view',
	'views/packages/info/versions/info/build/build-profile/package-type/java-source/java-source-package-view',
	'views/packages/info/versions/info/build/build-profile/package-type/java-bytecode/java-bytecode-package-view',
	'views/packages/info/versions/info/build/build-profile/package-type/android-source/android-source-package-view',
	'views/packages/info/versions/info/build/build-profile/package-type/android-bytecode/android-bytecode-package-view',
	'views/packages/info/versions/info/build/build-profile/package-type/python/python-package-view',
	'views/packages/info/versions/info/build/build-profile/package-type/ruby/ruby-package-view',
	'views/packages/info/versions/info/build/build-profile/package-type/web-scripting/web-scripting-package-view'
], function($, _, Backbone, Marionette, PlatformVersions, Template, Accordions, PackageDependenciesListView, CPackageView, JavaSourcePackageView, JavaBytecodePackageView, AndroidSourcePackageView, AndroidBytecodePackageView, PythonPackageView, RubyPackageView, WebScriptingPackageView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageType: '#package-type',
			packageDependencies: '#package-dependencies'
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
			this.showPackageDependencies();

			// show subviews
			//
			if (this.options.package) {
				this.showPackageType(this.options.package.getPackageType());
			}

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));

			// check build system
			//
			this.checkBuildSystem();
		},

		showPackageDependencies: function(){
			var self = this;
			var platformVersions = new PlatformVersions();
			platformVersions.fetchAll({

				// callbacks
				//
				success: function() {
					self.packageDependencies.show(
						new PackageDependenciesListView({
							collection: self.options.packageVersionDependencies,
							platformVersions: platformVersions,
							model: self.model,
							parent: self
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.error({
						message: "Could not fetch package dependencies."
					});
				}
			});
		},

		showPackageType: function(packageType) {
			switch (packageType) {

				// C/C++ package types
				//
				case 'c-source':
					this.packageType.show(
						new CPackageView({
							model: this.model,
							parent: this
						})
					);
					break;

				// java package types
				//
				case 'java7-source':
				case 'java8-source':
					this.packageType.show(
						new JavaSourcePackageView({
							model: this.model,
							parent: this
						})
					);
					break;
				case 'java7-bytecode':
				case 'java8-bytecode':
					this.packageType.show(
						new JavaBytecodePackageView({
							model: this.model,
							parent: this
						})
					);
					break;

				// android package types
				//
				case 'android-source':
					this.packageType.show(
						new AndroidSourcePackageView({
							model: this.model,
							parent: this
						})
					);
					break;
				case 'android-bytecode':
					this.packageType.show(
						new AndroidBytecodePackageView({
							model: this.model,
							parent: this
						})
					);
					break;

				// python package types
				//
				case 'python2':
				case 'python3':
					this.packageType.show(
						new PythonPackageView({
							model: this.model,
							parent: this
						})
					);
					break;

				// ruby package types
				//
				case 'ruby':
				case 'sinatra':
				case 'rails':
				case 'padrino':
					this.packageType.show(
						new RubyPackageView({
							model: this.model,
							parent: this
						})
					);
					break;	

				// web scripting package type
				//
				case 'web-scripting':
					this.packageType.show(
						new WebScriptingPackageView({
							model: this.model,
							parent: this
						})
					);
					break;
			}
		},

		//
		// build system validation methods
		//

		checkBuildSystem: function() {
			var self = this;

			// check build system
			//
			this.model.checkBuildSystem({

				// callbacks
				//
				success: function() {
					self.options.parent.hideWarning();
				},

				error: function(data) {
					self.options.parent.showWarning(data.responseText);
				}
			});
		}
	});
});
