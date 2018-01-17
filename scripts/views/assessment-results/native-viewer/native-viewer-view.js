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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/assessment-results/native-viewer/native-viewer.tpl',
	'registry',
	'views/assessment-results/native-viewer/list/weaknesses-list-view',
	'views/assessment-results/native-viewer/button-bars/nav-button-bar-view',
	'views/keyboard/keycodes',
	'utilities/browser/url-strings',
	'utilities/browser/query-strings',
	'utilities/time/date-format',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Template, Registry, WeaknessesListView, NavButtonBarView, KeyCodes) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			weaknessesList: '#weaknesses-list',
			navButtonBar: '#nav-button-bar'
		},

		events: {
			'click #show-numbering': 'onClickShowNumbering',
			'click #show-grouping': 'onClickShowGrouping'
		},

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

		//
		// rendering methods
		//

		template: function(data) {
			var report = data.AnalyzerReport;

			return _.template(Template, _.extend(data, {
				pageNumber: this.pageOf(this.from || 1),
				numPages: this.numPages(),

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
			}));
		},

		onRender: function() {

			// show subviews
			//
			this.showList();
			this.showNavButtonBar();
		},

		showList: function() {
			this.weaknessesList.show(
				new WeaknessesListView({
					collection: new Backbone.Collection(this.model.get('AnalyzerReport').BugInstances),
					showNumbering: Registry.application.options.showNumbering,
					showGrouping: Registry.application.options.showGrouping,
					start: this.from? this.from - 1: 0
				})
			);
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
						var pageNumber = this.pageOf(this.from);
					} else if (this.to) {
						var pageNumber = this.pageOf(this.to);
					} else {
						var pageNumber = 1;
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