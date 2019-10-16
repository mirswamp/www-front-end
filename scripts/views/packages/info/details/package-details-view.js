/******************************************************************************\
|                                                                              |
|                            package-details-view.js                           |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/details/package-details.tpl',
	'collections/packages/package-versions',
	'views/base-view',
	'views/packages/info/details/package-profile/package-profile-view',
	'views/packages/info/versions/list/package-versions-list-view'
], function($, _, Template, PackageVersions, BaseView, PackageProfileView, PackageVersionsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#package-profile',
			list: '#package-versions-list'
		},

		events: {
			'click #add-new-version': 'onClickAddNewVersion',
			'click #show-numbering': 'onClickShowNumbering',
			'click #run-new-assessment': 'onClickRunNewAssessment',
			'click #delete-package': 'onClickDeletePackage'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new PackageVersions();
		},

		//
		// methods
		//

		deletePackage: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
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

							// show error message
							//
							application.error({
								message: "Could not delete this package."
							});
						}
					});
				}
			});
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

					// show error message
					//
					application.error({
						message: "Could not fetch package versions."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				isOwned: this.model.isOwned(),
				isPublic: this.model.isPublic(),
				showNumbering: application.options.showNumbering
			};
		},

		onRender: function() {
			var self = this;

			// display project profile view
			//
			this.showChildView('profile', new PackageProfileView({
				model: this.model
			}));

			// fetch and show package versions 
			//
			this.fetchPackageVersions(function() {
				self.showPackageVersions();
			});
		},

		showPackageVersions: function() {

			// show package versions list view
			//
			this.showChildView('list', new PackageVersionsListView({
				model: this.model,
				collection: this.collection,
				showProjects: application.session.user.get('has_projects'),
				showNumbering: application.options.showNumbering
			}));
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

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showPackageVersions();
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
