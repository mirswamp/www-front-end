/******************************************************************************\
|                                                                              |
|                              project-filters-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing filters for projects.               |
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
	'text!templates/projects/filters/project-filters.tpl',
	'views/base-view',
	'views/widgets/filters/date-filter-view',
	'views/widgets/filters/limit-filter-view',
	'utilities/web/query-strings',
	'utilities/web/url-strings'
], function($, _, Validate, Collapse, Template, BaseView, DateFilterView, LimitFilterView, QueryStrings, UrlStrings) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
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
			tags += this.getChildView('date').getTags();
			tags += this.getChildView('limit').getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
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
					'date-filter': this.options.data.after != undefined || this.options.data.before != undefined,
					'limit-filter': this.options.data.limit != undefined
				}
			};
		},

		onRender: function() {
			var self = this;
			
			// show subviews
			//
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