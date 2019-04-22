/******************************************************************************\
|                                                                              |
|                              native-viewer-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the native viewer for displaying assessment results.     |
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
	'bootstrap/tab',
	'text!templates/results/native-viewer/native-viewer.tpl',
	'registry',
	'models/files/directory',
	'models/packages/package-version',
	'models/assessments/assessment-results',
	'views/results/native-viewer/list/weaknesses-list-view',
	'views/files/directory-tree/directory-tree-view',
	'views/results/native-viewer/directory-tree/package-version-directory-tree-view',
	'views/results/native-viewer/button-bars/nav-button-bar-view',
	'views/keyboard/keycodes',
	'views/dialogs/error-view',
	'utilities/browser/url-strings',
	'utilities/browser/query-strings',
	'utilities/time/date-format',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Tab, Template, Registry, Directory, PackageVersion, AssessmentResults, WeaknessesListView, DirectoryTreeView, PackageVersionDirectoryTreeView, NavButtonBarView, KeyCodes, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			weaknessList: '#weakness-list',
			navButtonBar: '#nav-button-bar',
			sourceTree: '#source-tree'
		},

		events: {
			'click #filter': 'onClickFilter',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping'
		},

		filter: [],

		//
		// constructor
		//

		initialize: function() {
			var queryString = getQueryString();

			// get values from query string
			//
			if (hasQueryVariable(queryString, 'from')) {
				this.from = parseInt(getQueryVariable(queryString, 'from'));
			}
			if (hasQueryVariable(queryString, 'to')) {
				this.to = parseInt(getQueryVariable(queryString, 'to'));
			}
			if (this.from && this.to) {
				this.itemsPerPage = this.to - this.from + 1;
			} else if (this.to) {
				this.itemsPerPage = this.to;
			}
		},

		//
		// querying methods
		//

		numItems: function() {
			return this.options.json.AnalyzerReport.BugCount;
		},

		pageOf: function(itemIndex) {
			if (this.itemsPerPage) {
				return Math.floor((itemIndex - 1) / this.itemsPerPage) + 1;
			} else {
				return 1;
			}
		},

		numPages: function() {
			if (this.itemsPerPage) {
				return  Math.ceil(this.numItems() / this.itemsPerPage);
			} else {
				return 1;
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			var report = this.options.json.AnalyzerReport;

			return _.template(Template, {
				report: report,
				// pageNumber: this.pageOf(this.from || 1),
				// numPages: this.numPages(),

				packageUrl: report.package && report.package.package_uuid?
					Registry.application.getURL() + '#packages/' + report.package.package_uuid : '',
				packageVersionUrl: report.package && report.package.package_version_uuid?
					Registry.application.getURL() + '#packages/versions/' + report.package.package_version_uuid : '',
			
				toolUrl: report.tool && report.tool.tool_uuid?
					Registry.application.getURL() + '#tools/' + report.tool.tool_uuid : '',
				toolVersionUrl: report.tool && report.tool.tool_version_uuid?
					Registry.application.getURL() + '#tools/versions/' + report.tool.tool_version_uuid : '',

				platformUrl: report.platform && report.platform.platform_uuid?
					Registry.application.getURL() + '#platforms/' + report.platform.platform_uuid : '',
				platformVersionUrl: report.platform && report.platform.platform_version_uuid?
					Registry.application.getURL() + '#platforms/versions/' + report.platform.platform_version_uuid : '',
	
				showNumbering: Registry.application.options.showNumbering,
				showGrouping: Registry.application.options.showGrouping
			});
		},

		onRender: function() {
			var report = this.options.json.AnalyzerReport;

			// show subviews
			//
			this.showWeaknessList();
			this.showNavButtonBar();
			this.showSourceTree(new PackageVersion({
				package_version_uuid: report.package.package_version_uuid
			}));
		},

		showWeaknessList: function() {
			this.weaknessList.show(new WeaknessesListView({
				collection: new Backbone.Collection(this.options.json.AnalyzerReport.BugInstances),
				showNumbering: Registry.application.options.showNumbering,
				showGrouping: Registry.application.options.showGrouping,
				start: this.from? this.from - 1: 0,
				results: this.options.results,
				projectUuid: this.options.projectUuid,
				filter_type: this.filter_type,
				filter: this.filter,
			}));
		},

		showSourceTree: function(packageVersion) {
			var self = this;
			var data = null;

			// set filtering params
			//
			if (this.filter) {
				switch (this.filter_type) {
					case 'include':
						data = {
							include: this.filter
						};
						break;
					case 'exclude':
						data = {
							exclude: this.filter
						};
						break;
				}
			}

			// fetch package version directory tree
			//
			packageVersion.fetchFileTree({
				data: data,

				// callbacks
				//
				success: function(data) {

					// show incremental directory tree
					//
					if (_.isArray(data)) {

						// top level is a directory listing
						//
						self.sourceTree.show(
							new PackageVersionDirectoryTreeView({
								model: new Directory({
									contents: data
								}),
								packageVersion: packageVersion,
								assessmentResultUuid: self.options.assessmentResultUuid,
								bugInstances: self.options.json.AnalyzerReport.BugInstances,
								results: self.options.results,
								projectUuid: self.options.projectUuid,
								filter_type: self.filter_type,
								filter: self.filter,
								expanded: false
							})
						);
					} else if (isDirectoryName(data.name)) {

						// top level is a directory
						//
						self.sourceTree.show(
							new PackageVersionDirectoryTreeView({
								model: new Directory({
									name: data.name,
								}),
								packageVersion: packageVersion,
								assessmentResultUuid: self.options.assessmentResultUuid,
								bugInstances: self.options.json.AnalyzerReport.BugInstances,
								results: self.options.results,
								projectUuid: self.options.projectUuid,
								filter_type: self.filter_type,
								filter: self.filter,
								expanded: false
							})
						);		
					} else {

						// top level is a file
						//
						self.sourceTree.show(
							new PackageVersionDirectoryTreeView({
								model: new Directory({
									contents: new File({
										name: data.name
									})
								}),
								packageVersion: packageVersion,
								assessmentResultUuid: self.options.assessmentResultUuid,
								bugInstances: self.options.json.AnalyzerReport.BugInstances,
								results: self.options.results,
								projectUuid: self.options.projectUuid,
								filter_type: self.filter_type,
								filter: self.filter,
								expanded: false
							})
						);	
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get a file tree for this package version."
						})
					);	
				}
			});
		},

		showNavButtonBar: function() {
			this.navButtonBar.show(
				new NavButtonBarView({
					itemsPerPage: this.itemsPerPage,
					maxItemsPerPage: this.constructor.maxItemsPerPage,
					pageNumber: this.pageOf(this.from),
					numPages: this.numPages(),
					parent: this
				})
			);
		},

		update: function() {
			var self = this;
			var data = null;

			// set filtering params
			//
			if (this.filter) {
				switch (this.filter_type) {
					case 'include':
						data = {
							include: this.filter
						};
						break;
					case 'exclude':
						data = {
							exclude: this.filter
						};
						break;
				}
			}

			new AssessmentResults({
				assessment_result_uuid: this.options.assessmentResultUuid
			}).fetchResults(this.options.viewerUuid, this.options.projectUuid, {
				data: _.extend({
					from: this.from,
					to: this.to
				}, data),

				// callbacks
				//
				success: function(data) {
					self.options.json = data.results;
					self.render();
				},

				error: function(response) {

					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get results."
						})
					);	
				}
			});
		},

		//
		// paging methods
		//

		setPage: function(pageNumber) {
			if (pageNumber <= 1) {

				// first page
				//
				setQueryString({
					'to': this.itemsPerPage
				});
			} else {
				if (pageNumber) {

					// clamp page to num pages
					//
					pageNumber = Math.min(pageNumber, this.numPages());
				} else {

					// find page of first item
					//
					if (this.from) {
						pageNumber = this.pageOf(this.from);
					} else if (this.to) {
						pageNumber = this.pageOf(this.to);
					} else {
						pageNumber = 1;
					}
				}

				// middle or last page
				//
				setQueryString({
					'from': (pageNumber - 1) * this.itemsPerPage + 1,
					'to': pageNumber * this.itemsPerPage
				});
			}
		},

		//
		// event handling methods
		//

		onClickFilter: function() {
			var self = this;
			new AssessmentResults({
				assessment_result_uuid: this.options.assessmentResultUuid
			}).fetchCatalog(this.options.viewerUuid, this.options.projectUuid, {

				// callbacks
				//
				success: function(data) {
					require([
						'views/results/native-viewer/dialogs/results-filter-dialog-view'
					], function (ResultsFilterDialogView) {
						Registry.application.modal.show(
							new ResultsFilterDialogView({
								catalog: data,
								filter_type: self.filter_type,
								filter: self.filter,

								// callbacks
								//
								accept: function(data) {
									self.filter_type = data.filter_type;
									self.filter = data.filter;
									self.update();
								}
							}), {
								size: 'large'
							}
						);
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get bug catalog."
						})
					);	
				}
			});
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		},

		onClickShowGrouping: function(event) {
			Registry.application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		},

		onKeyDown: function(event) {
			switch (event.which) {
				case KeyCodes.left:
					this.setPage(this.navButtonBar.currentView.pageNumber - 1);
					break;
				case KeyCodes.right:
					this.setPage(this.navButtonBar.currentView.pageNumber + 1);
					break;
				case KeyCodes.up:
					this.setPage(this.navButtonBar.currentView.numPages);
					break;
				case KeyCodes.down:
					this.setPage(1);
					break;
			}
		}
	}, {

		// static attributes
		//
		itemsPerPage: 50,
		maxItemsPerPage: 500
	});
});