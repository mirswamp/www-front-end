/******************************************************************************\
|                                                                              |
|                                 package-router.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for package routes.          |
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
	'backbone'
], function($, _, Backbone) {

	// create router
	//
	return Backbone.Router.extend({

		//
		// route definitions
		//

		routes: {

			// packages routes
			//
			'packages(?*query_string)': 'showPackages',
			'packages/public(?*query_string)': 'showPublicPackages',
			'packages/add': 'showAddNewPackage',

			// package administration routes
			//
			'packages/review(?*query_string)': 'showReviewPackages',

			// package routes
			//
			'packages/:package_uuid': 'showPackage',
			'packages/:package_uuid/compatibility': 'showPackageCompatibility',
			'packages/:package_uuid/edit': 'showEditPackage',
			'packages/:package_uuid/versions/add': 'showAddNewPackageVersion',

			// package version routes
			//
			'packages/versions/:package_version_uuid': 'showPackageVersion',
			'packages/versions/:package_version_uuid/edit': 'showEditPackageVersion',
			'packages/versions/:package_version_uuid/source': 'showPackageVersionSource',
			'packages/versions/:package_version_uuid/source/edit': 'showEditPackageVersionSource',
			'packages/versions/:package_version_uuid/build': 'showPackageVersionBuild',
			'packages/versions/:package_version_uuid/compatibility': 'showPackageVersionCompatibility',
			'packages/versions/:package_version_uuid/build/edit': 'showEditPackageVersionBuild',
			'packages/versions/:package_version_uuid/sharing': 'showPackageVersionSharing'
		},

		//
		// packages route handlers
		//

		showPackages: function(queryString) {
			require([
				'registry',
				'routers/query-string-parser',
				'views/packages/packages-view'
			], function (Registry, QueryStringParser, PackagesView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'packages', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {
							
							// show packages view
							//
							view.content.show(
								new PackagesView({
									model: view.model,
									data: data
								})
							)				
						});
					}
				});
			});
		},

		showPublicPackages: function(queryString) {
			require([
				'registry',
				'routers/query-string-parser',
				'views/packages/public-packages-view'
			], function (Registry, QueryStringParser, PublicPackagesView) {

				// show public packages view
				//
				Registry.application.showMain(
					new PublicPackagesView({
						data: QueryStringParser.parse(queryString)
					}), {
						nav: 'resources'
					}
				);
			});
		},

		showAddNewPackage: function() {
			require([
				'registry',
				'views/packages/add/add-new-package-view'
			], function (Registry, AddNewPackageView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'packages', 

					// callbacks
					//
					done: function(view) {

						// show add new package view
						//
						view.content.show(
							new AddNewPackageView()
						);
					}
				});
			});
		},

		//
		// package administration route handlers
		//

		showReviewPackages: function(queryString) {
			require([
				'registry',
				'routers/query-string-parser',
				'views/packages/review/review-packages-view',
			], function (Registry, QueryStringParser, ReviewPackagesView) {

				// show content view
				//
				Registry.application.showContent({
					'nav1': 'home',
					'nav2': 'overview', 

					// callbacks
					//
					done: function(view) {

						// show review packages view
						//
						view.content.show(
							new ReviewPackagesView({
								data: QueryStringParser.parse(queryString, view.model)
							})
						);
					}
				});
			});
		},

		//
		// package route helper functions
		//

		showPackageView: function(packageUuid, options) {
			var self = this;
			require([
				'registry',
				'models/packages/package',
				'views/dialogs/error-view',
				'views/packages/package-view'
			], function (Registry, Package, ErrorView, PackageView) {
				Package.fetch(packageUuid, function(package) {

					// check if user is logged in
					//
					if (Registry.application.session.user) {

						// show content view
						//
						Registry.application.showContent({
							nav1: package.isOwned()? 'home' : 'resources',
							nav2: package.isOwned()? 'packages' : undefined, 

							// callbacks
							//	
							done: function(view) {
								view.content.show(
									new PackageView({
										model: package,
										nav: options.nav,
										parent: view
									})
								);

								if (options.done) {
									options.done(view.content.currentView);
								}				
							}					
						});
					} else {

						// show single column package view
						//
						Registry.application.showMain(
							new PackageView({
								model: package,
								nav: options.nav
							}), {
							done: options.done
						});
					}
				});
			});
		},

		//
		// package route handlers
		//

		showPackage: function(packageUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/details/package-details-view'
			], function (Registry, PackageDetailsView) {

				// show package view
				//
				self.showPackageView(packageUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show package details view
						//
						view.packageInfo.show(
							new PackageDetailsView({
								model: view.model
							})
						);
					}
				});
			});
		},

		showPackageCompatibility: function(packageUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/compatibility/package-compatibility-view'
			], function (Registry, PackageCompatibilityView) {

				// show package view
				//
				self.showPackageView(packageUuid, {
					nav: 'compatibility', 

					// callbacks
					//
					done: function(view) {

						// show package compatibility view
						//
						view.packageInfo.show(
							new PackageCompatibilityView({
								model: view.model
							})
						);
					}
				});
			});
		},

		showEditPackage: function(packageUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/details/edit-package-details-view',
			], function (Registry, EditPackageDetailsView) {

				// show package view
				//
				self.showPackageView(packageUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show edit package details view
						//
						view.options.parent.content.show(
							new EditPackageDetailsView({
								model: view.model
							})
						);
					}
				});
			});
		},

		showAddNewPackageVersion: function(packageUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/versions/add/add-new-package-version-view'
			], function (Registry, AddNewPackageVersionView) {

				// show package view
				//
				self.showPackageView(packageUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show add new package version view
						//
						view.options.parent.content.show(
							new AddNewPackageVersionView({
								package: view.model
							})
						);
					}
				});
			});
		},

		//
		// package version route helper functions
		//

		showPackageVersionView: function(packageVersionUuid, options) {
			var self = this;
			require([
				'registry',
				'models/packages/package',
				'models/packages/package-version',
				'views/dialogs/error-view',
				'views/packages/info/versions/package-version-view'
			], function (Registry, Package, PackageVersion, ErrorView, PackageVersionView) {
				PackageVersion.fetch(packageVersionUuid, function(packageVersion) {
					Package.fetch(packageVersion.get('package_uuid'), function(package) {

						// check if user is logged in
						//
						if (Registry.application.session.user) {

							// show content view
							//
							Registry.application.showContent({
								nav1: package.isOwned()? 'home' : 'resources',
								nav2: package.isOwned()? 'packages' : undefined, 

								// callbacks
								//	
								done: function(view) {
									view.content.show(
										new PackageVersionView({
											model: packageVersion,
											package: package,
											nav: options.nav,
											parent: view
										})
									);

									if (options.done) {
										options.done(view.content.currentView);
									}				
								}					
							});
						} else {

							// show single column package version view
							//
							Registry.application.showMain(
								new PackageVersionView({
									model: packageVersion,
									package: package,
									nav: options.nav
								}), {
								done: options.done
							});
						}
					});
				});
			});
		},

		//
		// package version route handlers
		//

		showPackageVersion: function(packageVersionUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/versions/info/details/package-version-details-view'
			], function (Registry, PackageVersionDetailsView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'details',

					// callbacks
					// 
					done: function(view) {

						// show package version details view
						//
						view.packageVersionInfo.show(
							new PackageVersionDetailsView({
								model: view.model,
								package: view.options.package
							})
						);
					}
				});
			});
		},

		showEditPackageVersion: function(packageVersionUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/versions/info/details/edit-package-version-details-view'
			], function (Registry, EditPackageVersionDetailsView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show edit package version details view
						//
						view.options.parent.content.show(
							new EditPackageVersionDetailsView({
								model: view.model,
								package: view.options.package
							})
						);
					}
				});
			});
		},

		showPackageVersionSource: function(packageVersionUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/versions/info/source/package-version-source-view',
			], function (Registry, PackageVersionSourceView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'source', 

					// callbacks
					//
					done: function(view) {

						// show package version source view
						//
						view.packageVersionInfo.show(
							new PackageVersionSourceView({
								model: view.model,
								package: view.options.package
							})
						);
					}
				});
			});
		},

		showEditPackageVersionSource: function(packageVersionUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/versions/info/source/edit-package-version-source-view',
			], function (Registry, EditPackageVersionSourceView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'source',

					// callbacks
					// 
					done: function(view) {

						// show edit package version source view
						//
						view.options.parent.content.show(
							new EditPackageVersionSourceView({
								model: view.model,
								package: view.options.package
							})
						);
					}
				});
			});
		},

		showPackageVersionBuild: function(packageVersionUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/versions/info/build/package-version-build-view',
			], function (Registry, PackageVersionBuildView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'build',

					// callbacks
					// 
					done: function(view) {

						// show package version build view
						//
						view.packageVersionInfo.show(
							new PackageVersionBuildView({
								model: view.model,
								package: view.options.package
							})
						);
					}
				});
			});
		},

		showEditPackageVersionBuild: function(packageVersionUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/versions/info/build/edit-package-version-build-view',
			], function (Registry, EditPackageVersionBuildView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'build', 

					// callbacks
					//
					done: function(view) {

						// show edit package version build view
						//
						view.options.parent.content.show(
							new EditPackageVersionBuildView({
								model: view.model,
								package: view.options.package
							})
						);
					}
				});
			});
		},

		showPackageVersionCompatibility: function(packageVersionUuid) {
			var self = this;
			require([
				'registry',
				'views/packages/info/versions/info/compatibility/package-version-compatibility-view',
			], function (Registry, PackageVersionCompatibilityView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'compatibility',

					// callbacks
					// 
					done: function(view) {

						// show package version compatibility view
						//
						view.packageVersionInfo.show(
							new PackageVersionCompatibilityView({
								model: view.model,
								package: view.options.package
							})
						);
					}
				});
			});
		},

		showPackageVersionSharing: function(packageVersionUuid) {
			var self = this;
			require([
				'registry',
				'views/dialogs/error-view',
				'views/packages/info/versions/info/sharing/package-version-sharing-view',
			], function (Registry, ErrorView, PackageVersionSharingView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'sharing',

					// callbacks
					// 
					done: function(view) {

						// check sharing permissions
						//
						if (view.options.package.get('is_owned') || Registry.application.session.user.isAdmin()) {
							
							// show package version sharing view
							//
							view.packageVersionInfo.show(
								new PackageVersionSharingView({
									model: view.model,
									package: view.options.package
								})
							);
						} else {

							// show error dialog
							//
							Registry.application.modal.show(
								new ErrorView({
									message: "You must be the package owner or an admin to view sharing."
								})
							);	
						}
					}
				});
			});
		}
	});
});


