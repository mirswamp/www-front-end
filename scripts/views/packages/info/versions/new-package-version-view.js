/******************************************************************************\
|                                                                              |
|                           new-package-version-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package version's information.    |
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
	'text!templates/packages/info/versions/new-package-version.tpl',
	'registry',
	'collections/projects/projects',
	'views/dialogs/error-view',
	'views/dialogs/notify-view',
	'views/packages/info/versions/info/details/new-package-version-details-view',
	'views/packages/info/versions/info/source/new-package-version-source-view',
	'views/packages/info/versions/info/build/new-package-version-build-view',
	'views/packages/info/versions/info/sharing/new-package-version-sharing-view'
], function($, _, Backbone, Marionette, Template, Registry, Projects, ErrorView, NotifyView, NewPackageVersionDetailsView, NewPackageVersionSourceView, NewPackageVersionBuildView, NewPackageVersionSharingView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			newPackageVersionInfo: '#new-package-version-info'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
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

			// show new package version details view
			//
			this.newPackageVersionInfo.show(
				new NewPackageVersionDetailsView({
					model: this.model,
					package: this.options.package,
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

			// show new package version details view
			//
			this.newPackageVersionInfo.show(
				new NewPackageVersionSourceView({
					model: this.model,
					package: this.options.package,
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

			// show new package version build info view
			//
			this.newPackageVersionInfo.show(
				new NewPackageVersionBuildView({
					model: this.model,
					package: this.options.package,
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

			// show new package version build info view
			//
			this.newPackageVersionInfo.show(
				new NewPackageVersionSharingView({
					model: this.model,
					package: this.options.package,
					packageVersionDependencies: this.options.packageVersionDependencies,
					user: Registry.application.session.user,
					parent: this
				})
			);
		},

		showWarning: function(message) {
			this.$el.find('.alert-warning .message').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// utility methods
		//

		save: function(done) {
			var self = this;

			// set package version attributes
			//
			this.model.set({
				'package_uuid': this.options.package.get('package_uuid')
			});

			this.model.save(undefined, {

				// callbacks
				//
				success: function() {
					self.model.add({
						data: {
							'package_path': self.model.get('package_path')
						},

						// callbacks
						//
						success: function() {
							self.savePackageDependencies(done);
						},

						error: function(response) {

							// show error dialog
							//
							Registry.application.modal.show(
								new ErrorView({
									message: response.responseText
								})
							);
						}
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save package version."
						})
					);
				}
			});
		},

		savePackageDependencies: function(done) {
			var self = this;
			var vers_uuid = self.model.get('package_version_uuid');
			this.options.packageVersionDependencies.each(function(item) { 
				item.set('package_version_uuid', vers_uuid);
			});

			this.options.packageVersionDependencies.save({

				// callbacks
				//
				success: function() {
			
					// call optional callback
					//
					if (done) {
						done();
					}

					// show package
					//
					Backbone.history.navigate('#packages/' + self.options.package.get('package_uuid'), {
						trigger: true
					});
				}
			});
		}
	});
});
