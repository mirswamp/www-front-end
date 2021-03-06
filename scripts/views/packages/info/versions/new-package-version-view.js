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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/versions/new-package-version.tpl',
	'collections/projects/projects',
	'views/base-view',
	'views/packages/info/versions/info/details/new-package-version-details-view',
	'views/packages/info/versions/info/source/new-package-version-source-view',
	'views/packages/info/versions/info/build/new-package-version-build-view',
	'views/packages/info/versions/info/sharing/new-package-version-sharing-view'
], function($, _, Template, Projects, BaseView, NewPackageVersionDetailsView, NewPackageVersionSourceView, NewPackageVersionBuildView, NewPackageVersionSharingView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			info: '#new-package-version-info'
		},

		//
		// rendering methods
		//

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
					application.error({
						message: "Could not fetch number of projects."
					});
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
			this.showChildView('info', new NewPackageVersionDetailsView({
				model: this.model,
				package: this.options.package,
				packageVersionDependencies: this.options.packageVersionDependencies,
				parent: this
			}));
		},

		showSource: function() {

			// update top navigation
			//
			this.$el.find('.nav li').removeClass('active');
			this.$el.find('.nav li#source').addClass('active');

			// show new package version details view
			//
			this.showChildView('info', new NewPackageVersionSourceView({
				model: this.model,
				package: this.options.package,
				packageVersionDependencies: this.options.packageVersionDependencies,
				parent: this
			}));
		},

		showBuild: function() {

			// update top navigation
			//
			this.$el.find('.nav li').removeClass('active');
			this.$el.find('.nav li#build').addClass('active');

			// show new package version build info view
			//
			this.showChildView('info', new NewPackageVersionBuildView({
				model: this.model,
				package: this.options.package,
				packageVersionDependencies: this.options.packageVersionDependencies,
				showSave: !this.options.showSharing,
				parent: this
			}));
		},

		showSharing: function() {

			// update top navigation
			//
			this.$el.find('.nav li').removeClass('active');
			this.$el.find('.nav li#sharing').addClass('active');

			// show new package version build info view
			//
			this.showChildView('info', new NewPackageVersionSharingView({
				model: this.model,
				package: this.options.package,
				packageVersionDependencies: this.options.packageVersionDependencies,
				user: application.session.user,
				parent: this
			}));
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

							// show error message
							//
							application.error({
								message: response.responseText
							});
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save package version."
					});
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
					application.navigate('#packages/' + self.options.package.get('package_uuid'));
				}
			});
		}
	});
});
