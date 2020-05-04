/******************************************************************************\
|                                                                              |
|                           review-results-filters-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing run and result filters.             |
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
	'jquery.validate',
	'bootstrap/collapse',
	'text!templates/results/assessment-runs/filters/review-results-filters.tpl',
	'models/projects/project',
	'collections/projects/projects',
	'views/base-view',
	'views/tools/filters/tool-filter-view',
	'views/platforms/filters/platform-filter-view',
	'views/widgets/filters/date-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Validate, Collapse, Template, Project, Projects, BaseView, ToolFilterView, PlatformFilterView, DateFilterView, LimitFilterView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			tool: '#tool-filter',
			platform: '#platform-filter',
			date: '#date-filter',
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
			tags += this.getChildView('tool').getTag();
			tags += this.getChildView('platform').getTag();
			tags += this.getChildView('date').getTags();
			tags += this.getChildView('limit').getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'tool')) {
				_.extend(data, this.getChildView('tool').getData());
			}
			if (!attributes || _.contains(attributes, 'platform')) {
				_.extend(data, this.getChildView('platform').getData());
			}
			if (!attributes || _.contains(attributes, 'date')) {
				_.extend(data, this.getChildView('date').getData());
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
			if (!attributes || _.contains(attributes, 'tool')) {
				_.extend(attrs, this.getChildView('tool').getAttrs());
			}
			if (!attributes || _.contains(attributes, 'platform')) {
				_.extend(attrs, this.getChildView('platform').getAttrs());
			}
			if (!attributes || _.contains(attributes, 'date')) {
				_.extend(attrs, this.getChildView('date').getAttrs());
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
			queryString = addQueryString(queryString, this.getChildView('tool').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('platform').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('date').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('limit').getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.getChildView('tool').reset({
				silent: true
			});
			this.getChildView('platform').reset({
				silent: true
			});
			this.getChildView('date').reset({
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
					'tool-filter': this.options.data.tool != undefined || this.options.data['tool-version'] != undefined,
					'platform-filter': this.options.data.platform != undefined || this.options.data['platform-version'] != undefined,
					'date-filter': this.options.data.after != undefined || this.options.data.before != undefined,
					'limit-filter': this.options.data.limit !== null
				}
			};
		},

		onRender: function() {
			var self = this;
			
			// show subviews
			//
			this.showChildView('tool', new ToolFilterView({
				model: this.model,
				initialSelectedTool: this.options.data.tool,
				initialSelectedToolVersion: this.options.data['tool-version'],
				packageSelected: this.options.data.package,
				versionDefaultOptions: ["Any"],
				versionSelectedOptions: ['any'],
				
				// callbacks
				//
				onChange: function(changes) {
					self.getChildView('platform').setTool(changes.tool);
				}
			}));
			this.showChildView('platform', new PlatformFilterView({
				model: this.model,
				initialSelectedPlatform: this.options.data.platform,
				initialSelectedPlatformVersion: this.options.data['platform-version'],
				toolSelected: this.options.data.tool,
				versionDefaultOptions: ["Any"],
				versionSelectedOptions: ['any'],
				
				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));
			this.showChildView('date', new DateFilterView({
				initialAfterDate: this.options.data.after,
				initialBeforeDate: this.options.data.before,

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));
			this.showChildView('limit', new LimitFilterView({
				defaultValue: 50,
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