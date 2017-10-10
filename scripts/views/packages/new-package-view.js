/******************************************************************************\
|                                                                              |
|                                new-package-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a new package's information.        |
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
	'text!templates/packages/new-package.tpl',
	'registry',
	'collections/projects/projects',
	'views/dialogs/error-view',
	'views/dialogs/notify-view',
	'views/packages/info/details/new-package-details-view',
	'views/packages/info/source/new-package-source-view',
	'views/packages/info/build/new-package-build-view',
	'views/packages/info/sharing/new-package-sharing-view',
], function($, _, Backbone, Marionette, Template, Registry, Projects, ErrorView, NotifyView, NewPackageDetailsView, NewPackageSourceView, NewPackageBuildView, NewPackageSharingView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			newPackageInfo: '#new-package-info'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template);
		},

		onRender: function() {
			var self = this;

			// fetch number of projects
			//
			Projects.fetchNum({

				// callbacks
				//
				success: function(numProjects) {

					// determine whether or not to display sharing
					//
					self.options.showSharing = numProjects > 1;
				
					// hide / show sharing tab
					//
					if (self.options.showSharing) {
						self.$el.find('li#sharing').show();
					} else {
						self.$el.find('li#sharing').hide();
					}

					// show details
					//
					self.showDetails();
				},

				error: function() {

					// show error view
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch number of projects."
						})
					);	
				}
			});
		},

		showDetails: function() {

			// update top navigation
			//
			this.$el.find('.nav li').removeClass('active');
			this.$el.find('.nav li#details').addClass('active');

			// show new package details view
			//
			this.newPackageInfo.show(
				new NewPackageDetailsView({
					model: this.model,
					packageVersion: this.options.packageVersion,
					packageVersionDependencies: this.options.packageVersionDependencies,
					parent: this
				})
			);
		},

		showSource: function() {

			// update top navigation
			//
			this.$el.find('.nav li').removeClass('active');
			this.$el.find('.nav li#source').addClass('active');

			// show new package source view
			//
			this.newPackageInfo.show(
				new NewPackageSourceView({
					model: this.model,
					packageVersion: this.options.packageVersion,
					packageVersionDependencies: this.options.packageVersionDependencies,
					parent: this
				})
			);
		},

		showBuild: function() {

			// update top navigation
			//
			this.$el.find('.nav li').removeClass('active');
			this.$el.find('.nav li#build').addClass('active');

			// show new package build view
			//
			this.newPackageInfo.show(
				new NewPackageBuildView({
					model: this.model,
					packageVersion: this.options.packageVersion,
					packageVersionDependencies: this.options.packageVersionDependencies,
					showSave: !this.options.showSharing,
					parent: this
				})
			);
		},

		showSharing: function() {

			// update top navigation
			//
			this.$el.find('.nav li').removeClass('active');
			this.$el.find('.nav li#sharing').addClass('active');

			// show new package sharing view
			//
			this.newPackageInfo.show(
				new NewPackageSharingView({
					model: this.model,
					packageVersion: this.options.packageVersion,
					packageVersionDependencies: this.options.packageVersionDependencies,
					parent: this
				})
			);
		},

		//
		// utility methods
		//

		save: function(done) {
			var self = this;

			// save package
			//
			this.model.save(undefined, {

				// callbacks
				//
				success: function() {

					// save package version
					//
					self.saveVersion(done);
				}, 

				error: function(jqxhr, textstatus, errorThrown) {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save package: " + errorThrown.xhr.responseText
						})
					);
				}
			});
		},

		saveVersion: function(done) {
			var self = this;

			// set package version attributes
			//
			this.options.packageVersion.set({
				'package_uuid': this.model.get('package_uuid')
			});

			this.options.packageVersion.store({

				// callbacks
				//
				success: function() {

					// perform callbacks
					//
					if (done) {
						self.savePackageDependencies( done );
					}
				},

				error: function(jqxhr, textstatus, errorThrown) {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save package version: " + errorThrown.xhr.responseText
						})
					);
				}
			});
		},

		savePackageDependencies: function( done ){
			var self = this;

			// set package version of dependencies
			//
			var vers_uuid = this.options.packageVersion.get('package_version_uuid');
			this.options.packageVersionDependencies.each(function( item  ){ 
				item.set('package_version_uuid', vers_uuid);
			});

			// save dependencies
			//
			this.options.packageVersionDependencies.save({

				// callbacks
				//
				success: function(){
					if (done) {
						done();
					}

					// show package
					//
					Backbone.history.navigate('#packages/' + self.model.get('package_uuid'), {
						trigger: true
					});
				}
			});
		}
	});
});
