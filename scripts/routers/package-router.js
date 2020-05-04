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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'routers/base-router'
], function($, _, BaseRouter) {

	// create router
	//
	return BaseRouter.extend({

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
				'routers/query-string-parser',
				'views/packages/packages-view'
			], function (QueryStringParser, PackagesView) {

				// show content view
				//
				application.showContent({
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
							view.showChildView('content', new PackagesView({
								model: view.model,
								data: data
							}));
						});
					}
				});
			});
		},

		showPublicPackages: function(queryString) {
			require([
				'routers/query-string-parser',
				'views/packages/public-packages-view'
			], function (QueryStringParser, PublicPackagesView) {

				// show public packages view
				//
				application.showMain(new PublicPackagesView({
					data: QueryStringParser.parse(queryString)
				}), {
					nav: 'resources'
				});
			});
		},

		showAddNewPackage: function() {
			require([
				'views/packages/add/add-new-package-view'
			], function (AddNewPackageView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'packages', 

					// callbacks
					//
					done: function(view) {

						// show add new package view
						//
						view.showChildView('content', new AddNewPackageView());
					}
				});
			});
		},

		//
		// package administration route handlers
		//

		showReviewPackages: function(queryString) {
			require([
				'routers/query-string-parser',
				'views/packages/review/review-packages-view',
			], function (QueryStringParser, ReviewPackagesView) {

				// show content view
				//
				application.showContent({
					'nav1': 'home',
					'nav2': 'overview', 

					// callbacks
					//
					done: function(view) {

						// show review packages view
						//
						view.showChildView('content', new ReviewPackagesView({
							data: QueryStringParser.parse(queryString, view.model)
						}));
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
				'models/packages/package',
				'views/packages/package-view'
			], function (Package, PackageView) {
				Package.fetch(packageUuid, function(package) {

					// check if user is logged in
					//
					if (application.session.user) {

						// show content view
						//
						application.showContent({
							nav1: package.isOwned()? 'home' : 'resources',
							nav2: package.isOwned()? 'packages' : undefined, 

							// callbacks
							//	
							done: function(view) {

								// show package view
								//
								view.showChildView('content', new PackageView({
									model: package,
									nav: options.nav,
									parent: view
								}));

								// perform callback
								//
								if (options.done) {
									options.done(view.getChildView('content'));
								}				
							}					
						});
					} else {

						// show single column package view
						//
						application.showMain(new PackageView({
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
				'views/packages/info/details/package-details-view'
			], function (PackageDetailsView) {

				// show package view
				//
				self.showPackageView(packageUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show package details view
						//
						view.showChildView('info', new PackageDetailsView({
							model: view.model
						}));
					}
				});
			});
		},

		showPackageCompatibility: function(packageUuid) {
			var self = this;
			require([
				'views/packages/info/compatibility/package-compatibility-view'
			], function (PackageCompatibilityView) {

				// show package view
				//
				self.showPackageView(packageUuid, {
					nav: 'compatibility', 

					// callbacks
					//
					done: function(view) {

						// show package compatibility view
						//
						view.showChildView('info', new PackageCompatibilityView({
							model: view.model
						}));
					}
				});
			});
		},

		showEditPackage: function(packageUuid) {
			var self = this;
			require([
				'views/packages/info/details/edit-package-details-view',
			], function (EditPackageDetailsView) {

				// show package view
				//
				self.showPackageView(packageUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show edit package details view
						//
						view.options.parent.showChildView('content', new EditPackageDetailsView({
							model: view.model
						}));
					}
				});
			});
		},

		showAddNewPackageVersion: function(packageUuid) {
			var self = this;
			require([
				'views/packages/info/versions/add/add-new-package-version-view'
			], function (AddNewPackageVersionView) {

				// show package view
				//
				self.showPackageView(packageUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show add new package version view
						//
						view.options.parent.showChildView('content', new AddNewPackageVersionView({
							package: view.model
						}));
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
				'models/packages/package',
				'models/packages/package-version',
				'views/packages/info/versions/package-version-view'
			], function (Package, PackageVersion, PackageVersionView) {
				PackageVersion.fetch(packageVersionUuid, function(packageVersion) {
					Package.fetch(packageVersion.get('package_uuid'), function(package) {

						// check if user is logged in
						//
						if (application.session.user) {

							// show content view
							//
							application.showContent({
								nav1: package.isOwned()? 'home' : 'resources',
								nav2: package.isOwned()? 'packages' : undefined, 

								// callbacks
								//	
								done: function(view) {

									// show package version
									//
									view.showChildView('content', new PackageVersionView({
										model: packageVersion,
										package: package,
										nav: options.nav,
										parent: view
									}));

									// perform callback
									//
									if (options.done) {
										options.done(view.getChildView('content'));
									}				
								}					
							});
						} else {

							// show single column package version view
							//
							application.showMain(new PackageVersionView({
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
				'views/packages/info/versions/info/details/package-version-details-view'
			], function (PackageVersionDetailsView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'details',

					// callbacks
					// 
					done: function(view) {

						// show package version details view
						//
						view.showChildView('info', new PackageVersionDetailsView({
							model: view.model,
							package: view.options.package
						}));
					}
				});
			});
		},

		showEditPackageVersion: function(packageVersionUuid) {
			var self = this;
			require([
				'views/packages/info/versions/info/details/edit-package-version-details-view'
			], function (EditPackageVersionDetailsView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show edit package version details view
						//
						view.options.parent.showChildView('content', new EditPackageVersionDetailsView({
							model: view.model,
							package: view.options.package
						}));
					}
				});
			});
		},

		showPackageVersionSource: function(packageVersionUuid) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/package-version-source-view',
			], function (PackageVersionSourceView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'source', 

					// callbacks
					//
					done: function(view) {

						// show package version source view
						//
						view.showChildView('info', new PackageVersionSourceView({
							model: view.model,
							package: view.options.package
						}));
					}
				});
			});
		},

		showEditPackageVersionSource: function(packageVersionUuid) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/edit-package-version-source-view',
			], function (EditPackageVersionSourceView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'source',

					// callbacks
					// 
					done: function(view) {

						// show edit package version source view
						//
						view.options.parent.showChildView('content', new EditPackageVersionSourceView({
							model: view.model,
							package: view.options.package
						}));
					}
				});
			});
		},

		showPackageVersionBuild: function(packageVersionUuid) {
			var self = this;
			require([
				'views/packages/info/versions/info/build/package-version-build-view',
			], function (PackageVersionBuildView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'build',

					// callbacks
					// 
					done: function(view) {

						// show package version build view
						//
						view.showChildView('info', new PackageVersionBuildView({
							model: view.model,
							package: view.options.package
						}));
					}
				});
			});
		},

		showEditPackageVersionBuild: function(packageVersionUuid) {
			var self = this;
			require([
				'views/packages/info/versions/info/build/edit-package-version-build-view',
			], function (EditPackageVersionBuildView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'build', 

					// callbacks
					//
					done: function(view) {

						// show edit package version build view
						//
						view.options.parent.showChildView('content', new EditPackageVersionBuildView({
							model: view.model,
							package: view.options.package
						}));
					}
				});
			});
		},

		showPackageVersionCompatibility: function(packageVersionUuid) {
			var self = this;
			require([
				'views/packages/info/versions/info/compatibility/package-version-compatibility-view',
			], function (PackageVersionCompatibilityView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'compatibility',

					// callbacks
					// 
					done: function(view) {

						// show package version compatibility view
						//
						view.showChildView('info', new PackageVersionCompatibilityView({
							model: view.model,
							package: view.options.package
						}));
					}
				});
			});
		},

		showPackageVersionSharing: function(packageVersionUuid) {
			var self = this;
			require([
				'views/packages/info/versions/info/sharing/package-version-sharing-view',
			], function (PackageVersionSharingView) {

				// show package version view
				//
				self.showPackageVersionView(packageVersionUuid, {
					nav: 'sharing',

					// callbacks
					// 
					done: function(view) {

						// check sharing permissions
						//
						if (view.options.package.get('is_owned') || application.session.user.isAdmin()) {
							
							// show package version sharing view
							//
							view.showChildView('info', new PackageVersionSharingView({
								model: view.model,
								package: view.options.package
							}));
						} else {

							// show error message
							//
							application.error({
								message: "You must be the package owner or an admin to view sharing."
							});
						}
					}
				});
			});
		}
	});
});