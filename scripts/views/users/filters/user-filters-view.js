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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'jquery.validate',
	'bootstrap/collapse',
	'text!templates/users/filters/user-filters.tpl',
	'views/base-view',
	'views/users/filters/username-filter-view',
	'views/users/filters/user-name-filter-view',
	'views/users/filters/user-type-filter-view',
	'views/widgets/filters/date-filter-view',
	'views/widgets/filters/limit-filter-view',
	'utilities/web/query-strings',
	'utilities/web/url-strings'
], function($, _, Validate, Collapse, Template, BaseView,  UsernameFilterView, UserNameFilterView, UserTypeFilterView, DateFilterView, LimitFilterView, QueryStrings, UrlStrings) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			username: '#username-filter',
			name: '#user-name-filter',
			type: '#user-type-filter',
			date: '#date-filter',
			last_login: '#last-login-date-filter',
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
			tags += this.getChildView('username').getTag();
			tags += this.getChildView('name').getTag();	
			tags += this.getChildView('type').getTag();
			tags += this.getChildView('date').getTags();
			tags += this.getChildView('last_login').getTags();
			tags += this.getChildView('limit').getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'username')) {
				_.extend(data, this.getChildView('username').getData());
			}
			if (!attributes || _.contains(attributes, 'name')) {
				_.extend(data, this.getChildView('name').getData());
			}
			if (!attributes || _.contains(attributes, 'type')) {
				_.extend(data, this.getChildView('type').getData());
			}
			if (!attributes || _.contains(attributes, 'date')) {
				_.extend(data, this.getChildView('date').getData());
			}
			if (!attributes || _.contains(attributes, 'last_login_date')) {
				_.extend(data, this.getChildView('last_login').getData());
			}
			if (!attributes || _.contains(attributes, 'limit')) {
				_.extend(data, this.getChildView('limit').getData());
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
			queryString = addQueryString(queryString, this.getChildView('username').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('name').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('type').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('date').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('last_login').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('limit').getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.getChildView('username').reset({
				silent: true
			});
			this.getChildView('name').reset({
				silent: true
			});
			this.getChildView('type').reset({
				silent: true
			});
			this.getChildView('date').reset({
				silent: true
			});
			this.getChildView('last_login').reset({
				silent: true
			});
			this.getChildView('limit').reset({
				silent: true
			});

			// update
			//
			this.onChange();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				highlighted: {
					'username-filter': this.options.data.name != undefined,
					'name-filter': this.options.data.name != undefined,
					'type-filter': this.options.data.type != undefined,
					'date-filter': this.options.data.after != undefined || this.options.data.before != undefined,
					'last-login-date-filter': this.options.data['login-after'] != undefined || this.options.data['login-before'] != undefined,
					'limit-filter': this.options.data.limit != undefined
				}
			};
		},

		onRender: function() {
			var self = this;
			
			// show subviews
			//
			this.showChildView('username', new UsernameFilterView({
				model: this.model,
				initialValue: this.options.data.username,

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));
			this.showChildView('name', new UserNameFilterView({
				model: this.model,
				initialValue: this.options.data.name,

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));
			this.showChildView('type', new UserTypeFilterView({
				model: this.model,
				initialValue: this.options.data.type,

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
			this.showChildView('last_login', new DateFilterView({
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
			if (this.options.onChange && (!options || !options.silent)) {
				this.options.onChange();
			}
		}
	});
});