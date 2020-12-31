/******************************************************************************\
|                                                                              |
|                             review-accounts-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for reviewing, accepting, or declining            |
|        user account approval.                                                |
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
	'text!templates/users/review/review-accounts.tpl',
	'collections/users/users',
	'views/base-view',
	'views/users/filters/user-filters-view',
	'views/users/review/review-accounts-list/review-accounts-list-view'
], function($, _, Template, Users, BaseView, UserFiltersView, ReviewAccountsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			filters: '#user-filters',
			list: '#review-accounts-list'
		},

		events: {
			//'change select': 'onChangeSelect',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel',
			'click #show-signed-in-accounts': 'onClickShowSignedInAccounts',
			'click #show-disabled-accounts': 'onClickShowDisabledAccounts',
			'click #show-stats': 'onClickShowStats',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Users();
		},

		//
		// querying methods
		//

		getShowSignedInAccounts: function() {
			return this.$el.find('#show-signed-in-accounts').is(':checked');
		},

		getShowDisabledAccounts: function() {
			return this.$el.find('#show-disabled-accounts').is(':checked');
		},

		getShowStats: function() {
			return this.$el.find('#show-stats').is(':checked');
		},
		
		getQueryString: function() {
			return this.getChildView('filters').getQueryString();
		},

		getFilterData: function() {
			return this.getChildView('filters').getData();
		},

		//
		// ajax methods
		//

		fetchAll: function(done) {

			// fetch user accounts
			//
			this.request = this.collection.fetchAll({
				data: this.getChildView('filters')? this.getChildView('filters').getAttrs() : null,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch all users."
					});
				}
			});
		},

		fetchEnabled: function(done) {

			// fetch user accounts
			//
			this.request = this.collection.fetchEnabled({
				data: this.getChildView('filters')? this.getChildView('filters').getAttrs() : null,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch enabled users."
					});
				}
			});
		},

		fetchSignedIn: function(done) {

			// fetch user accounts
			//
			this.request = this.collection.fetchSignedIn({
				data: this.getChildView('filters')? this.getChildView('filters').getAttrs() : null,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch signed in users."
					});
				}
			});
		},

		fetchUsers: function(done) {
			var signedInAccounts = this.getShowSignedInAccounts();
			var disabledAccounts = this.getShowDisabledAccounts();

			if (signedInAccounts) {
				return this.fetchSignedIn(done);
			} else if (disabledAccounts) {
				return this.fetchAll(done);
			} else {
				return this.fetchEnabled(done);
			}
		},

		saveAccounts: function() {
			this.collection.save({

				// callbacks
				//
				success: function() {

					// show success notification dialog
					//
					application.notify({
						title: "User Account Changes Saved",
						message: "Your user account changes have been successfully saved."
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Your user account changes could not be saved."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				userType: this.options.data.type? this.options.data.type.replace('-', ' ').toTitleCase() : undefined,
				showSignedInAccounts: this.options.showSignedInAccounts ? true : false,	
				showDisabledAccounts: this.options.showDisabledAccounts ? true : false,
				showStats: this.options.showStats ? true : false
			};
		},

		onRender: function() {

			// show user filters
			//
			this.showFilters();

			// show user accounts list
			//
			this.fetchAndShowList();
		},

		showFilters: function() {
			var self = this;

			// show user filters
			//
			this.showChildView('filters', new UserFiltersView({
				model: this.model,
				data: this.options.data? this.options.data : {},

				// callbacks
				//
				onChange: function() {
				
					// update filter data
					//
					var projects = self.options.data.projects;
					self.options.data = self.getFilterData();
					self.options.data.projects = projects;

					// update url
					//
					var queryString = self.getQueryString();
					var state = window.history.state;
					var url = getWindowBaseLocation() + (queryString? ('?' + queryString) : '');
					window.history.pushState(state, '', url);

					// update view
					//
					self.onChange();
				}
			}));
		},

		fetchAndShowList: function() {
			var self = this;
			this.fetchUsers(function() {
				self.showList();
			});
		},

		showList: function() {
			var self = this;

			// preserve existing sorting column and order
			//
			if (this.hasChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			// show review user accounts list
			//
			this.showChildView('list', new ReviewAccountsListView({
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				showType: true,
				showForcePasswordReset: application.config.email_enabled,
				showHibernate: application.config.email_enabled,
				showLinkedAccount: application.config.linked_accounts_enabled,
				showStats: this.options.showStats,
				showNumPackages: true,
				showNumProjects: true,
				showNumRuns: true,
				showNumResults: true,
				showSuccessRate: true,
				
				// callbacks
				//
				onChange: function() {

					// enable save button
					//
					self.$el.find('#save').prop('disabled', false);
				}
			}));
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update list
			//
			this.fetchAndShowList();
		},

		onChangeSelect: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickSave: function() {

			// disable save button
			//
			this.$el.find('#save').prop('disabled', true);

			// save
			//
			this.saveAccounts();
		},

		onClickCancel: function() {

			// return to overview
			//
			application.navigate('#overview');
		},

		onClickShowSignedInAccounts: function() {
			this.fetchAndShowList();
		},

		onClickShowDisabledAccounts: function() {
			this.fetchAndShowList();
		},

		onClickShowStats: function() {
			this.options.showStats = this.getShowStats();
			this.showList();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {

			// clear pending requests
			//
			if (this.request && this.request.state() == 'pending') {
				this.request.abort();
			}
		}
	});
});
