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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/tab',
	'text!templates/results/native-viewer/native-viewer.tpl',
	'models/files/directory',
	'models/packages/package-version',
	'models/assessments/assessment-results',
	'collections/results/weaknesses',
	'views/base-view',
	'views/results/native-viewer/list/weaknesses-list-view',
	'views/files/directory-tree/directory-tree-view',
	'views/results/native-viewer/directory-tree/package-version-directory-tree-view',
	'views/layout/nav-button-bar-view',
	'views/keyboard/keycodes',
	'utilities/web/url-strings',
	'utilities/web/query-strings',
	'utilities/time/date-format',
	'utilities/time/date-utils'
], function($, _, Tab, Template, Directory, PackageVersion, AssessmentResults, Weaknesses, BaseView, WeaknessesListView, DirectoryTreeView, PackageVersionDirectoryTreeView, NavButtonBarView, KeyCodes) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '.weakness-list',
			nav: '.nav-button-bar',
			tree: '.source-tree'
		},

		events: {
			'click #filter': 'onClickFilter',
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping'
		},

		filter: [],
		defaultItemsPerPage: 100,

		//
		// constructor
		//

		initialize: function() {
			var queryString = getQueryString();

			// get values from query string
			//
			if (hasQueryStringValue(queryString, 'from')) {
				this.from = parseInt(getQueryStringValue(queryString, 'from'));
			}
			if (hasQueryStringValue(queryString, 'to')) {
				this.to = parseInt(getQueryStringValue(queryString, 'to'));
			}

			// compute items per page
			//
			if (this.from && this.to) {
				this.itemsPerPage = this.to - this.from + 1;
			} else if (this.to) {
				this.itemsPerPage = this.to;
			} else {
				this.itemsPerPage = this.defaultItemsPerPage;
			}

			// set filter
			//
			var data = queryStringToData(queryString);
			if (data.include) {
				this.filter_type = 'include';
				this.filter = data.include.split(',');
			}
			if (data.exclude) {
				this.filter_type = 'exclude';
				this.filter = data.exclude.split(',');
			}
		},

		//
		// querying methods
		//

		numItems: function() {
			return this.model.get('AnalyzerReport').BugCount;
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

		getFilterData: function(data) {
			if (!data) {
				data = {};
			}
			if (this.filter) {
				switch (this.filter_type) {
					case 'include':
						data.include = this.filter;
						break;
					case 'exclude':
						data.exclude = this.filter;
						break;
				}
			}
			return data;
		},

		//
		// url querying methods
		//

		getPackageUrl: function() {
			if (this.model.has('package')) {
				return application.getURL() + '#packages/' + this.model.get('package').package_uuid;
			}
		},

		getPackageVersionUrl: function() {
			if (this.model.has('package')) {
				return application.getURL() + '#packages/' + this.model.get('package').package_version_uuid;
			}
		},

		getToolUrl: function() {
			if (this.model.has('tool')) {
				return application.getURL() + '#tools/' + this.model.get('tool').tool_uuid;
			}
		},

		getToolVersionUrl: function() {
			if (this.model.has('tool')) {
				return application.getURL() + '#tools/' + this.model.get('tool').tool_version_uuid;
			}
		},

		getPlatformUrl: function() {
			if (this.model.has('platform')) {
				return application.getURL() + '#platforms/' + this.model.get('platform').platform_uuid;
			}
		},

		getPlatformVersionUrl: function() {
			if (this.model.has('platform')) {
				return application.getURL() + '#platforms/' + this.model.get('platform').platform_version_uuid;
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				report: this.model.get('AnalyzerReport'),
				// pageNumber: this.pageOf(this.from || 1),
				// numPages: this.numPages(),

				// urls
				//
				package_url: this.getPackageUrl(),
				package_version_url: this.getPackageVersionUrl(),

				tool_url: this.getToolUrl(),
				tool_version_url: this.getToolVersionUrl(),
				
				platform_url: this.getPlatformUrl(),
				platform_version_url: this.getPlatformVersionUrl(),
	
				// options
				//
				showGrouping: application.options.showGrouping
			};
		},

		onRender: function() {

			// show subviews
			//
			this.showList();
			this.showNavButtonBar();
			this.fetchAndShowSourceTree(new PackageVersion({
				package_version_uuid: this.model.get('package').package_version_uuid
			}));
		},

		showList: function() {

			// preserve existing sorting column and order
			//
			if (this.getChildView('list')) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			this.showChildView('list', new WeaknessesListView({
				collection: new Weaknesses(this.model.get('AnalyzerReport').BugInstances),
				
				// options
				//
				sortBy: this.options.sortBy,
				showGrouping: application.options.showGrouping,
				start: this.from? this.from - 1: 0,
				results: this.options.results,
				projectUuid: this.options.projectUuid,
				filter_type: this.filter_type,
				filter: this.filter,
			}));
		},

		fetchAndShowSourceTree: function(packageVersion) {
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
					self.showSourceTree(data, packageVersion);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get a file tree for this package version."
					});
				}
			});
		},

		showSourceTree: function(data, packageVersion) {

			// show incremental directory tree
			//
			if (_.isArray(data)) {

				// top level is a directory listing
				//
				this.showChildView('tree', new PackageVersionDirectoryTreeView({
					model: new Directory({
						contents: data
					}),
					packageVersion: packageVersion,
					assessmentResultUuid: this.options.assessmentResultUuid,
					bugInstances: this.model.get('AnalyzerReport').BugInstances,
					results: this.options.results,
					projectUuid: this.options.projectUuid,
					filter_type: this.filter_type,
					filter: this.filter,
					expanded: false
				}));
			} else if (isDirectoryName(data.name)) {

				// top level is a directory
				//
				this.showChildView('tree', new PackageVersionDirectoryTreeView({
					model: new Directory({
						name: data.name,
					}),
					packageVersion: packageVersion,
					assessmentResultUuid: this.options.assessmentResultUuid,
					bugInstances: this.model.get('AnalyzerReport').BugInstances,
					results: this.options.results,
					projectUuid: this.options.projectUuid,
					filter_type: this.filter_type,
					filter: this.filter,
					expanded: false
				}));		
			} else {

				// top level is a file
				//
				this.showChildView('tree', new PackageVersionDirectoryTreeView({
					model: new Directory({
						contents: new File({
							name: data.name
						})
					}),
					packageVersion: packageVersion,
					assessmentResultUuid: this.options.assessmentResultUuid,
					bugInstances: this.model.get('AnalyzerReport').BugInstances,
					results: this.options.results,
					projectUuid: this.options.projectUuid,
					filter_type: this.filter_type,
					filter: this.filter,
					expanded: false
				}));	
			}
		},

		showNavButtonBar: function() {
			this.showChildView('nav', new NavButtonBarView({
				itemsPerPage: this.itemsPerPage,
				maxItemsPerPage: this.constructor.maxItemsPerPage,
				pageNumber: this.pageOf(this.from),
				numPages: this.numPages(),
				parent: this
			}));
		},

		update: function() {
			var self = this;

			new AssessmentResults({
				assessment_result_uuid: this.options.assessmentResultUuid
			}).fetchResults(this.options.viewerUuid, this.options.projectUuid, {
				data: _.extend({
					from: this.from,
					to: this.to
				}, this.getFilterData()),

				// callbacks
				//
				success: function(data) {
					self.model = new Backbone.Model(data.results);
					self.render();
				},

				error: function(response) {

					// show error message
					//
					application.error({
						message: "Could not get results."
					});
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
				setQueryString(toQueryString(_.extend({
					'to': this.itemsPerPage
				}, this.getFilterData())));
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
				setQueryString(toQueryString(_.extend({
					'from': (pageNumber - 1) * this.itemsPerPage + 1,
					'to': pageNumber * this.itemsPerPage
				}, this.getFilterData())));
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
						application.show(new ResultsFilterDialogView({
							catalog: data,
							filter_type: self.filter_type,
							filter: self.filter,

							// callbacks
							//
							accept: function(data) {
								self.filter_type = data.filter_type;
								self.filter = data.filter;

								// show first page
								//
								self.from = undefined;
								self.to = self.itemsPerPage;
								self.update();

								// get query string data
								//
								data = queryStringToData(getQueryString());

								// go to first page
								//
								if (data.from) {
									delete data.from;
								}
								data.to = self.itemsPerPage;							

								// add filter data
								//
								data = self.getFilterData(data);

								// set url
								//
								var queryString = dataToQueryString(data);
								var state = window.history.state;
								var url = getWindowBaseLocation() + (queryString? ('?' + queryString) : '');
								window.history.pushState(state, '', url);
							}
						}));
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get bug catalog."
					});
				}
			});
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		},

		onClickShowGrouping: function(event) {
			application.setShowGrouping($(event.target).is(':checked'));
			this.showList();
		},

		onKeyDown: function(event) {
			switch (event.which) {
				case KeyCodes.left:
					this.setPage(this.getChildView('nav').pageNumber - 1);
					break;
				case KeyCodes.right:
					this.setPage(this.getChildView('nav').pageNumber + 1);
					break;
				case KeyCodes.up:
					this.setPage(this.getChildView('nav').numPages);
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