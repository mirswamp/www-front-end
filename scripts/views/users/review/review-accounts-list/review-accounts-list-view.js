/******************************************************************************\
|                                                                              |
|                           review-accounts-list-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of user accounts            |
|        for review.                                                           |
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
	'bootstrap/popover',
	'text!templates/users/review/review-accounts-list/review-accounts-list.tpl',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/users/review/review-accounts-list/review-accounts-list-item-view'
], function($, _, Popover, Template, BaseView, SortableTableListView, ReviewAccountsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: ReviewAccountsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No accounts.")
		}),

		events: {
			'click .force-password-reset .select-all': 'onClickForcePasswordResetSelectAll',
			'click .hibernate .select-all': 'onClickHibernateSelectAll'
		},

		// sort by create date column in descending order 
		//
		sortBy: ['create-date', 'descending'],
		unsorted: SortableTableListView.prototype.unsorted.concat(
			['force-password-reset', 'hibernate']),

		//
		// constructor
		//

		initialize: function(options) {

			// call superclass method
			//
			SortableTableListView.prototype.initialize.call(this, _.extend(options, {
				sorting: this.getSorting()
			}));

			// count of user stats fetched
			//
			this.count = 0;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,

				// options
				//
				showType: this.options.showType,
				showForcePasswordReset: this.options.showForcePasswordReset,
				showHibernate: this.options.showHibernate,
				showLinkedAccount: this.options.showLinkedAccount,
				showStats: this.options.showStats,
				showNumPackages: this.options.showNumPackages,
				showNumProjects: this.options.showNumProjects,
				showNumRuns: this.options.showNumRuns,
				showNumResults: this.options.showNumResults,
				showSuccessRate: this.options.showSuccessRate
			};
		},

		childViewOptions: function(model) {

			// check if empty view
			//
			if (!model) {
				return {};
			}

			// return view options
			//
			return {
				index: this.collection.indexOf(model),
				parent: this,

				// options
				//
				showType: this.options.showType,
				showForcePasswordReset: this.options.showForcePasswordReset,
				showHibernate: this.options.showHibernate,
				showLinkedAccount: this.options.showLinkedAccount,
				showStats: this.options.showStats,
				showNumPackages: this.options.showNumPackages,
				showNumProjects: this.options.showNumProjects,
				showNumRuns: this.options.showNumRuns,
				showNumResults: this.options.showNumResults,
				showSuccessRate: this.options.showSuccessRate,

				// callbacks
				//
				onChange: this.options.onChange
			}; 
		},

		onAttach: function() {
			if (!this.options.showStats) {
				this.update();
			}
		},

		update: function() {

			// call superclass method
			//
			SortableTableListView.prototype.onRender.call(this);

			// add tooltip triggers
			//
			this.addTooltips({
				container: 'body'
			});
		},

		//
		// event handling methods
		//

		onClickForcePasswordResetSelectAll: function(event) {
			var self = this;

			if ($(event.target).prop('checked')) {

				// show confirmation
				//
				application.confirm({
					title: 'Force Password Reset',
					message: 'This will force the selected users to reset their password.  Note that this only affects the users shown in the list so you may have to remove the limit filter to select all users.  Changes will not be applied until you save.',
					
					// callbacks
					//
					accept: function() {

						// select all
						//
						self.$el.find('.force-password-reset input').prop('checked', true);
						self.collection.setForcePasswordReset(true);
					},

					reject: function() {
						self.$el.find('.force-password-reset .select-all').prop('checked', false);
					}
				});
			} else {

				// show confirmation
				//
				application.confirm({
					title: 'Unforce Password Reset',
					message: 'This will remove the requirement for the selected users to reset their password.  Note that this only affects the users shown in the list so you may have to remove the limit filter to select users.  Changes will not be applied until you save.',
					
					// callbacks
					//
					accept: function() {

						// deselect all
						//
						self.$el.find('.force-password-reset input').prop('checked', false);
						self.collection.setForcePasswordReset(false);
					},

					reject: function() {
						self.$el.find('.force-password-reset .select-all').prop('checked', true);
					}
				});
			}

			this.options.onChange();
		},

		onClickHibernateSelectAll: function(event) {
			var self = this;

			if ($(event.target).prop('checked')) {

				// show confirmation
				//
				application.confirm({
					title: 'Hibernate Users',
					message: 'This will mark the selected users as hibernating / inactive.  Note that this only affects the users shown in the list so you may have to remove the limit filter to select all users.  Changes will not be applied until you save.',
					
					// callbacks
					//
					accept: function() {

						// select all
						//
						self.$el.find('.hibernate input').prop('checked', true);
						self.collection.setHibernating(true);
					},

					reject: function() {
						self.$el.find('.hibernate .select-all').prop('checked', false);
					}
				});
			} else {

				// show confirmation
				//
				application.confirm({
					title: 'Awake Users from Hibernation',
					message: 'This will mark the selected users as NOT hibernating / inactive.  Note that this only affects the users shown in the list so you may have to remove the limit filter to select users.  Changes will not be applied until you save.',
					
					// callbacks
					//
					accept: function() {

						// deselect all
						//
						self.$el.find('.hibernate input').prop('checked', false);
						self.collection.setHibernating(false);
					},

					reject: function() {
						self.$el.find('.hibernate .select-all').prop('checked', true);
					}
				});
			}

			this.options.onChange();
		}
	});
});
