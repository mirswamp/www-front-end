/******************************************************************************\
|                                                                              |
|                              package-filter-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package filter.                   |
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
	'bootstrap/collapse',
	'text!templates/packages/filters/package-filter.tpl',
	'utilities/web/query-strings',
	'views/base-view',
	'views/packages/selectors/package-filter-selector-view'
], function($, _, Collapse, Template, QueryStrings, BaseView, PackageFilterSelectorView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			selector: '.name-selector',
			version_selector: '.version-filter-selector'
		},

		events: {
			'click #include-public input': 'onClickIncludePublic',
			'click #reset': 'onClickReset'
		},

		maxTagLength: 40,

		//
		// constructor
		//

		initialize: function() {

			// set attributes
			//
			if (this.options.initialSelectedPackage) {
				this.selected = this.options.initialSelectedPackage;
			}
			if (this.options.initialSelectedPackageVersion) {
				this.selectedVersion = this.options.initialSelectedPackageVersion;
			}
		},

		//
		// setting methods
		//

		setProject: function(project, options) {
			this.getChildView('selector').setProject(project, options);
		},

		reset: function(options) {

			// reset attributes
			//
			this.selected = undefined;
			this.selectedVersion = undefined;

			// reset selector
			//
			this.getChildView('selector').reset({
				silent: true
			});

			this.onChange(options);
		},

		update: function(options) {
			this.getChildView('selector').update({
				silent: true
			});
			this.onChange(options);
		},
		
		//
		// querying methods
		//

		hasSelected: function() {
			return this.selected != undefined;
		},

		getSelected: function() {
			return this.selected;
		},

		getSelectedVersion: function() {
			return this.selectedVersion;
		},

		getDescription: function() {
			return this.getChildView('selector').getDescription();
		},

		tagify: function(text) {
			return '<span class="tag' + (this.hasSelected()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#package-filter">' + 
				'<i class="fa fa-gift"></i>' + text + '</span>';
		},

		getTag: function() {
			var description = this.getDescription();
			return this.tagify(description? description.truncatedTo(this.maxTagLength) : '?');
		},

		getData: function() {
			var data = {};
			var package = this.getSelected();
			var packageVersion = this.getSelectedVersion();

			// add package data
			//
			if (package && package != 'any') {
				data.package = package;
			}

			// add package version data
			//
			if (packageVersion && packageVersion != 'any') {
				data['package-version'] = packageVersion;
			}
			
			return data;
		},

		getAttrs: function() {
			var attrs = {};
			var package = this.getSelected();
			var packageVersion = this.getSelectedVersion();

			// add package uuid
			//
			if (package && (!packageVersion || typeof packageVersion == 'string')) {
				attrs.package_uuid = package.get('package_uuid');
			}

			// add package version uuid
			//
			if (packageVersion && packageVersion != 'any') {
				if (typeof packageVersion == 'string') {
					attrs.package_version_uuid = packageVersion;
				} else {
					attrs.package_version_uuid = packageVersion.get('package_version_uuid');
				}
			}

			return attrs;
		},

		getQueryString: function() {
			var queryString = '';
			var package = this.getSelected();
			var packageVersion = this.getSelectedVersion();

			// add package uuid
			//
			if (package && (!packageVersion || typeof packageVersion == 'string')) {
				queryString = addQueryString(queryString, 'package=' + package.get('package_uuid'));
			}

			// add package version uuid
			//
			if (packageVersion && packageVersion != 'any') {
				if (typeof packageVersion == 'string') {
					queryString = addQueryString(queryString, 'package-version=' + packageVersion);
				} else {
					queryString = addQueryString(queryString, 'package-version=' + packageVersion.get('package_version_uuid'));
				}
			}

			return queryString;
		},

		//
		// rendering methods
		//

		onRender: function() {

			// set show public checkbox
			//
			if (this.options.initialSelectedPackage && this.options.initialSelectedPackage.isPublic()) {
				this.$el.find('#include-public input').prop('checked', true);
			}

			// show child views
			//
			this.showPackageSelector();

			// update reset button
			//
			this.updateReset();
		},

		showPackageSelector: function() {
			var self = this;

			if (this.getRegion('selector').currentView) {
				this.getRegion('selector').currentView.destroy();
			}

			// show subviews
			//
			this.showChildView('selector', new PackageFilterSelectorView({
				project: this.model,
				projects: this.options.projects,
				initialValue: this.options.initialSelectedPackage,
				initialVersion: this.options.initialSelectedPackageVersion,
				versionFilterSelector: this.getRegion('version_selector'),
				versionFilterLabel: this.$el.find('.version label'),
				versionDefaultOptions: this.options.versionDefaultOptions,
				versionSelectedOptions: this.options.versionSelectedOptions,
				showPublicPackages: this.$el.find('#include-public input').is(':checked'),

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));
		},

		//
		// reset button related methods
		//

		showReset: function() {
			this.$el.find('#reset').show();
		},

		hideReset: function() {
			this.$el.find('#reset').hide();
		},

		updateReset: function() {
			if (this.hasSelected()) {
				this.showReset();
			} else {
				this.hideReset();
			}
		},

		//
		// event handling methods
		//

		onClickIncludePublic: function() {

			// update package selector
			//
			this.showPackageSelector();

			// update
			//
			this.reset();
		},

		onChange: function(options) {

			// update package
			//
			this.selected = this.getChildView('selector').getSelected();

			// update package version
			//
			this.selectedVersion = this.getChildView('version_selector')?
				this.getChildView('version_selector').getSelected() : undefined;

			// update reset button
			//
			this.updateReset();

			// call on change callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange({
					package: this.selected, 
					packageVersion: this.selectedVersion
				});
			}
		},

		onClickReset: function() {
			this.reset();
		}
	});
});