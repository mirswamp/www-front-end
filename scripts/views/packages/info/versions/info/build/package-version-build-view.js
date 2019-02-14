/******************************************************************************\
|                                                                              |
|                         package-version-build-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package version's build           |
|        information.                                                          |
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
	'text!templates/packages/info/versions/info/build/package-version-build.tpl',
	'registry',
	'widgets/accordions',
	'models/packages/package-version',
	'collections/packages/package-version-dependencies',
	'views/packages/info/versions/info/build/build-profile/build-profile-view',
	'views/packages/info/versions/info/build/build-script/build-script-view'
], function($, _, Backbone, Marionette, Template, Registry, Accordions, PackageVersion, PackageVersionDependencies, BuildProfileView, BuildScriptView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			buildProfile: '#build-profile'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #edit': 'onClickEdit',
			'click #show-source-files': 'onClickShowSourceFiles',
			'click #show-build-script': 'onClickShowBuildScript',
			'click #cancel': 'onClickCancel',
			'click #prev': 'onClickPrev',
			'click #next': 'onClickNext',
			'click #start': 'onClickStart'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				package: this.options.package,
				show_navigation: this.options.showNavigation,
				show_source_files: !this.options.package.isBuildable() && !this.model.isAtomic(),
				show_build_script: this.model.hasBuildScript() && this.options.package.hasBuildScript()
			}));
		},

		onRender: function() {

			// show subviews
			//
			this.showBuildProfile();

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		},

		showBuildProfile: function() {
			var self = this;
			self.packageVersionDependencies = new PackageVersionDependencies();
			self.packageVersionDependencies.fetchByPackageVersion( self.model.get('package_version_uuid'), {
				success: function(){

					// show build profile
					//
					self.buildProfile.show(
						new BuildProfileView({
							model: self.model,
							package: self.options.package,
							packageVersionDependencies: self.packageVersionDependencies,
							readonly: true,
							parent: self
						})
					);
				}

			});
		},

		showSourceFiles: function() {
			var self = this;

			// get current model
			//
			var model = new PackageVersion(this.model.attributes);

			// fetch build info
			//
			model.fetchBuildInfo({
				data: {
					'package_type_id': this.options.package.get('package_type_id'),
					'build_dir': this.model.get('build_dir') || '.'
				},
				
				// callbacks
				//
				success: function(data) {
					model.set({
						'source_files': data.source_files
					});

					self.showSourceFilesDialog(model);
				}
			});
		},
		
		showSourceFilesDialog: function(packageVersion) {
			var self = this;
			require([
				'views/packages/dialogs/source-files-dialog-view'
			], function (SourceFilesDialogView) {
				Registry.application.modal.show(
					new SourceFilesDialogView({
						model: packageVersion,
						package: self.options.package
					})
				);
			});
		},

		showBuildScript: function() {
			var self = this;

			// get current model
			//
			var model = new PackageVersion(this.model.attributes);

			// fetch build info
			//
			model.fetchBuildInfo({
				data: {
					'package_type_id': this.options.package.get('package_type_id'),
					'build_dir': model.get('build_dir') || '.'
				},
				
				// callbacks
				//
				success: function(data) {
					model.set({
						'no_build_cmd': data.no_build_cmd
					});

					// show build script dialog
					//
					self.showBuildScriptDialog(model);
				}
			});
		},

		showBuildScriptDialog: function(packageVersion) {
			var self = this;
			require([
				'views/packages/dialogs/build-script-dialog-view'
			], function (BuildScriptDialogView) {
				Registry.application.modal.show(
					new BuildScriptDialogView({
						model: packageVersion,
						package: self.options.package
					})
				);
			});
		},

		hideBuildScript: function() {
			this.$el.find('#build-script-accordion').hide();
		},

		showWarning: function(message) {
			this.$el.find('.alert-warning .message').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
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
					self.hideWarning();
				},

				error: function(data) {
					self.showWarning(data.responseText);
				}
			});
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickEdit: function() {

			// go to edit package version build info view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/build/edit', {
				trigger: true
			});
		},

		onClickShowSourceFiles: function() {
			this.showSourceFiles();
		},

		onClickShowBuildScript: function() {
			this.showBuildScript();
		},

		onClickCancel: function() {

			// go to package version view
			//
			Backbone.history.navigate('#packages/' + this.options.package.get('package_uuid'), {
				trigger: true
			});
		},

		onClickPrev: function() {

			// go to package version source view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/source', {
				trigger: true
			});
		},

		onClickNext: function() {

			// go to package version sharing view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/sharing', {
				trigger: true
			});
		},

		onClickStart: function() {

			// go to package version details view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid'), {
				trigger: true
			});
		}
	});
});
