/******************************************************************************\
|                                                                              |
|                                user-filters-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing filters for user accounts.          |
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
	'backbone',
	'marionette',
	'validate',
	'collapse',
	'modernizr',
	'text!templates/users/filters/user-filters.tpl',
	'registry',
	'utilities/browser/query-strings',
	'utilities/browser/url-strings',
	'views/users/filters/user-type-filter-view',
	'views/widgets/filters/date-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Backbone, Marionette, Validate, Collapse, Modernizr, Template, Registry, QueryStrings, UrlStrings, UserTypeFilterView, DateFilterView, LimitFilterView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			typeFilter: '#user-type-filter',
			dateFilter: '#date-filter',
			lastLoginDateFilter: '#last-login-date-filter',
			limitFilter: '#limit-filter'
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
			tags += this.typeFilter.currentView.getTag();
			tags += this.dateFilter.currentView.getTags();
			tags += this.lastLoginDateFilter.currentView.getTags();
			tags += this.limitFilter.currentView.getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'type')) {
				_.extend(data, this.typeFilter.currentView.getData());
			}
			if (!attributes || _.contains(attributes, 'date')) {
				_.extend(data, this.dateFilter.currentView.getData());
			}
			if (!attributes || _.contains(attributes, 'last_login_date')) {
				_.extend(data, this.lastLoginDateFilter.currentView.getData());
			}
			if (!attributes || _.contains(attributes, 'limit')) {
				_.extend(data, this.limitFilter.currentView.getData());
			}

			return data;
		},

		getAttrs: function(attributes) {
			return this.getData(attributes);
		},

		getQueryString: function() {
			var queryString = '';

			// add info for filters
			//
			queryString = addQueryString(queryString, this.typeFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.dateFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.lastLoginDateFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.limitFilter.currentView.getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.typeFilter.currentView.reset({
				silent: true
			});
			this.dateFilter.currentView.reset({
				silent: true
			});
			this.lastLoginDateFilter.currentView.reset({
				silent: true
			});
			this.limitFilter.currentView.reset({
				silent: true
			});

			// update
			//
			this.onChange();
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				highlighted: {
					'type-filter': this.options.data['type'] != undefined,
					'date-filter': this.options.data['after'] != undefined || this.options.data['before'] != undefined,
					'last-login-date-filter': this.options.data['login-after'] != undefined || this.options.data['login-before'] != undefined,
					'limit-filter': this.options.data['limit'] != undefined
				}
			}));
		},

		onRender: function() {
			var self = this;
			
			// show subviews
			//
			this.typeFilter.show(new UserTypeFilterView({
				model: this.model,
				initialValue: this.options.data['type'],

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));
			this.dateFilter.show(new DateFilterView({
				model: this.model,
				initialAfterDate: this.options.data['after'],
				initialBeforeDate: this.options.data['before'],

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}				
			}));
			this.lastLoginDateFilter.show(new DateFilterView({
				model: this.model,
				id: "last-login-date-filter",
				title: "Last Login Date",
				icon: "fa-keyboard-o",
				afterFilterName: 'login-after',
				beforeFilterName: 'login-before',
				initialAfterDate: this.options.data['login-after'],
				initialBeforeDate: this.options.data['login-before'],

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}				
			}));
			this.limitFilter.show(new LimitFilterView({
				model: this.model,
				defaultValue: 50,
				initialValue: this.options.data['limit'],

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
			if (this.options.onChange && (!options || !options.silent)) {
				this.options.onChange();
			}
		}
	});
});