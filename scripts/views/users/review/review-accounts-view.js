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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/review/review-accounts.tpl',
	'config',
	'registry',
	'collections/users/users',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/users/filters/user-filters-view',
	'views/users/review/review-accounts-list/review-accounts-list-view'
], function($, _, Backbone, Marionette, Template, Config, Registry, Users, NotifyView, ErrorView, UserFiltersView, ReviewAccountsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			userFilters: '#user-filters',
			reviewAccountsList: '#review-accounts-list'
		},

		events: {
			//'change select': 'onChangeSelect',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel',
			'click #show-disabled-accounts': 'onClickShowDisabledAccounts',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Users();
		},

		showDisabledAccounts: function() {
			return this.$el.find('#show-disabled-accounts').is(':checked');
		},

		//
		// querying methods
		//

		getQueryString: function() {
			return this.userFilters.currentView.getQueryString();
		},

		getFilterData: function() {
			return this.userFilters.currentView.getData();
		},

		//
		// ajax methods
		//

		fetchAccounts: function(done) {

			// fetch user accounts
			//
			this.collection.fetchAll({
				data: this.userFilters.currentView? this.userFilters.currentView.getAttrs() : null,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not load users."
						})
					);
				}
			});
		},

		saveAccounts: function() {
			this.collection.save({

				// callbacks
				//
				success: function() {

					// show success notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							title: "User Account Changes Saved",
							message: "Your user account changes have been successfully saved."
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Your user account changes could not be saved."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(){
			return _.template(Template, {
				userType: this.options.data['type']? this.options.data['type'].replace('-', ' ').toTitleCase() : undefined,
				showDisabledAccounts: this.options.showDisabledAccounts ? true : false,
				showNumbering: Registry.application.getShowNumbering()
			});
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
			this.userFilters.show(
				new UserFiltersView({
					model: this.model,
					data: this.options.data? this.options.data : {},

					// callbacks
					//
					onChange: function() {
						// setQueryString(self.userFilters.currentView.getQueryString());			
					
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
				})
			);
		},

		fetchAndShowList: function() {
			var self = this;
			this.fetchAccounts(function() {
				self.showList();
			});
		},

		showList: function() {
			var self = this;

			// show review user accounts list
			//
			this.reviewAccountsList.show(
				new ReviewAccountsListView({
					collection: this.showDisabledAccounts()? this.collection : this.collection.getEnabled(),
					showNumbering: Registry.application.getShowNumbering(),
					showForcePasswordReset: Registry.application.config['email_enabled'],
					showHibernate: Registry.application.config['email_enabled'],
					showLinkedAccount: Registry.application.config['linked_accounts_enabled'],

					// callbacks
					//
					onChange: function() {

						// enable save button
						//
						self.$el.find('#save').prop('disabled', false);
					}
				})
			);
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
			Backbone.history.navigate('#overview', {
				trigger: true
			});
		},

		onClickShowDisabledAccounts: function() {
			this.showList();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		},
	});
});
