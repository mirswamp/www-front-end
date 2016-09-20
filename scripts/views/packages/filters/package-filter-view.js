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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'collapse',
	'modernizr',
	'text!templates/packages/filters/package-filter.tpl',
	'utilities/query-strings',
	'views/packages/selectors/package-filter-selector-view'
], function($, _, Backbone, Marionette, Collapse, Modernizr, Template, QueryStrings, PackageFilterSelectorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageFilterSelector: '.name-selector',
			packageVersionFilterSelector: '.version-filter-selector'
		},

		events: {
			'click #reset': 'onClickReset'
		},

		maxTagLength: 40,

		//
		// methods
		//

		initialize: function() {
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
			this.packageFilterSelector.currentView.setProject(project, options);
		},

		reset: function(options) {

			// reset attributes
			//
			this.selected = undefined;
			this.selectedVersion = undefined;

			// reset selector
			//
			this.packageFilterSelector.currentView.reset({
				silent: true
			});

			this.onChange(options);
		},

		update: function(options) {
			this.packageFilterSelector.currentView.update({
				silent: true
			});
			this.onChange(options);
		},
		
		//
		// querying methods
		//

		hasSelected: function() {
			return this.packageFilterSelector.currentView.hasSelected();
		},

		getSelected: function() {
			return this.selected;
		},

		getSelectedVersion: function() {
			return this.selectedVersion;
		},

		getDescription: function() {
			return this.packageFilterSelector.currentView.getDescription();
		},

		tagify: function(text) {
			return '<span class="tag' + (this.hasSelected()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#package-filter">' + 
				'<i class="fa fa-gift"></i>' + text + '</span>';
		},

		getTag: function() {
			return this.tagify(this.getDescription().truncatedTo(this.maxTagLength));
		},

		getData: function() {
			var data = {};
			var package = this.getSelected();
			var packageVersion = this.getSelectedVersion();

			// add package data
			//
			if (package && package != 'any') {
				data['package'] = package;
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

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {
			var self = this;

			// show subviews
			//
			this.packageFilterSelector.show(
				new PackageFilterSelectorView([], {
					project: this.model,
					projects: this.options.projects,
					initialValue: this.options.initialSelectedPackage,
					initialVersion: this.options.initialSelectedPackageVersion,
					versionFilterSelector: this.packageVersionFilterSelector,
					versionFilterLabel: this.$el.find('.version label'),
					versionDefaultOptions: this.options.versionDefaultOptions,
					versionSelectedOptions: this.options.versionSelectedOptions,

					// callbacks
					//
					onChange: function() {
						self.onChange();
					}
				})
			);

			// update reset button
			//
			this.updateReset();
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

		onChange: function(options) {

			// update package
			//
			this.selected = this.packageFilterSelector.currentView.getSelected();

			// update package version
			//
			this.selectedVersion = this.packageVersionFilterSelector.currentView?
				this.packageVersionFilterSelector.currentView.getSelected() : undefined;

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