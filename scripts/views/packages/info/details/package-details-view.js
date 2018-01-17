/******************************************************************************\
|                                                                              |
|                             package-details-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package's profile info.           |
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
	'text!templates/packages/info/details/package-details.tpl',
	'registry',
	'collections/packages/package-versions',
	'views/dialogs/confirm-view',
	'views/dialogs/error-view',
	'views/packages/info/details/package-profile/package-profile-view',
	'views/packages/info/versions/list/package-versions-list-view'
], function($, _, Backbone, Marionette, Template, Registry, PackageVersions, ConfirmView, ErrorView, PackageProfileView, PackageVersionsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageProfile: '#package-profile',
			packageVersionsList: '#package-versions-list'
		},

		events: {
			'click #add-new-version': 'onClickAddNewVersion',
			'click #run-new-assessment': 'onClickRunNewAssessment',
			'click #delete-package': 'onClickDeletePackage'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new PackageVersions();
		},

		deletePackage: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Package",
					message: "Are you sure that you would like to delete package " + self.model.get('name') + "? " +
						"All versions of this package and any scheduled assessments using this package will be deleted. Existing assessment results will not be deleted.",

					// callbacks
					//
					accept: function() {

						// delete user
						//
						self.model.destroy({

							// callbacks
							//
							success: function() {

								// return to packages view
								//
								Backbone.history.navigate('#packages', {
									trigger: true
								});
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this package."
									})
								);
							}
						});
					}
				})
			);
		},

		//
		// ajax methods
		//

		fetchPackageVersions: function(done) {
			var self = this;

			// fetch package versions
			//
			this.collection.fetchByPackage(this.model, {

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch package versions."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				isOwned: this.model.isOwned(),
				isPublic: this.model.isPublic()
			}));
		},

		onRender: function() {
			var self = this;

			// display project profile view
			//
			this.packageProfile.show(
				new PackageProfileView({
					model: this.model
				})
			);

			// fetch and show package versions 
			//
			this.fetchPackageVersions(function() {
				self.showPackageVersions();
			});
		},

		showPackageVersions: function() {

			// show package versions list view
			//
			this.packageVersionsList.show(
				new PackageVersionsListView({
					model: this.model,
					collection: this.collection
				})
			);
		},

		//
		// event handling methods
		//

		onClickAddNewVersion: function() {

			// go to add new package version view
			//
			Backbone.history.navigate('#packages/' + this.model.get('package_uuid') + '/versions/add', {
				trigger: true
			});
		},

		onClickRunNewAssessment: function() {

			// go to run new assessment view
			//
			Backbone.history.navigate('#assessments/run?package=' + this.model.get('package_uuid'), {
				trigger: true
			});
		},

		onClickDeletePackage: function() {
			this.deletePackage();
		}
	});
});
