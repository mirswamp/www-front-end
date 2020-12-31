/******************************************************************************\
|                                                                              |
|                            public-package-filters-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing public packages filters.            |
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
	'jquery.validate',
	'bootstrap/collapse',
	'text!templates/packages/filters/public-package-filters.tpl',
	'utilities/web/query-strings',
	'utilities/web/url-strings',
	'models/projects/project',
	'collections/projects/projects',
	'views/base-view',
	'views/packages/filters/package-type-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Validate, Collapse, Template, QueryStrings, UrlStrings, Project, Projects, BaseView, PackageTypeFilterView, LimitFilterView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			package_type: '#package-type-filter',
			limit: '#limit-filter'
		},

		events: {
			'click #reset-filters': 'onClickResetFilters'
		},

		//
		// querying methods
		//

		getTags: function() {
			var tags = '';

			// add tags
			//
			tags += this.getChildView('package_type').getTag();
			tags += this.getChildView('limit').getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'package-type')) {
				_.extend(data, this.getChildView('package_type').getData());
			}
			if (!attributes || _.contains(attributes, 'limit')) {
				_.extend(data, this.getChildView('limit').getData());
			}

			return data;
		},

		getAttrs: function(attributes) {
			var attrs = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'package-type')) {
				_.extend(attrs, this.getChildView('package_type').getAttrs());
			}
			if (!attributes || _.contains(attributes, 'limit')) {
				_.extend(attrs, this.getChildView('limit').getAttrs());
			}

			return attrs;
		},

		getQueryString: function() {
			var queryString = '';

			// add info for filters
			//
			queryString = addQueryString(queryString, this.getChildView('package_type').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('limit').getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.getChildView('package_type').reset({
				silent: true
			});
			this.getChildView('limit').reset({
				silent: true
			});

			// update
			//
			this.onChange(options);
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				highlighted: {
					'type-filter': this.options.data.type != undefined,
					'limit-filter': this.options.data.limit != undefined
				}
			};
		},

		onRender: function() {
			var self = this;
			
			// show subviews
			//
			this.showChildView('package_type', new PackageTypeFilterView({
				model: this.model,
				initialValue: this.options.data.type,

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}			
			}));
			this.showChildView('limit', new LimitFilterView({
				defaultValue: undefined,
				initialValue: this.options.data.limit,

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));

			// show filter controls
			//
			this.showTags();
		},

		showTags: function() {
			this.$el.find('#filter-controls').html(this.getTags());
		},

		//
		// event handling methods
		//

		onClickResetFilters: function() {
			this.reset();
		},

		onChange: function(options) {

			// update filter controls
			//
			this.showTags();

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange();
			}
		}
	});
});