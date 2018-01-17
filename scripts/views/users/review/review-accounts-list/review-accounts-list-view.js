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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/popover',
	'text!templates/users/review/review-accounts-list/review-accounts-list.tpl',
	'registry',
	'views/dialogs/confirm-view',
	'views/widgets/lists/sortable-table-list-view',
	'views/users/review/review-accounts-list/review-accounts-list-item-view'
], function($, _, Backbone, Marionette, Popover, Template, Registry, ConfirmView, SortableTableListView, ReviewAccountsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: ReviewAccountsListItemView,

		events: {
			'click .force-password-reset .select-all': 'onClickForcePasswordResetSelectAll',
			'click .hibernate .select-all': 'onClickHibernateSelectAll'
		},

		//
		// constructor
		//

		initialize: function(options) {

			// call superclass method
			//
			SortableTableListView.prototype.initialize.call(this, _.extend(options, {
				sorting: this.getSorting()
			}));
		},

		//
		// querying methods
		//

		getSorting: function() {
			return {

				// disable sorting on select columns
				//
				headers: this.getHeaders(),

				// sort on date column in descending order 
				//
				sortList: this.getSortList()
			}
		},

		getHeaders: function() {
			var headers = {};
			var column = 4;

			// disable sorting on select columns
			//
			if (this.options.showForcePasswordReset) {
				headers[column] = {
					sorter: false
				}
				column++;
			}
			if (this.options.showHibernate) {
				headers[column] = {
					sorter: false
				}
				column++;
			}
			if (this.options.showLinkedAccount) {
				headers[column++] = {
					sorter: false
				}
				column++;
			}

			return headers;
		},

		getSortList: function() {

			// sort on date column in descending order 
			//
			return [[this.getDateColumn(), 1]];
		},

		getDateColumn: function() {
			var dateColumn = 4;
			if (this.options.showForcePasswordReset) {
				dateColumn++;
			}
			if (this.options.showHibernate) {
				dateColumn++;
			}
			if (this.options.showLinkedAccount) {
				dateColumn++;
			}
			return dateColumn;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				config: Registry.application.config,
				showForcePasswordReset: this.options.showForcePasswordReset,
				showHibernate: this.options.showHibernate,
				showLinkedAccount: this.options.showLinkedAccount,
				showNumbering: this.options.showNumbering
			}));
		},

		childViewOptions: function(model, index) {
			return {
				index: index,
				showNumbering: this.options.showNumbering,
				showForcePasswordReset: this.options.showForcePasswordReset,
				showHibernate: this.options.showHibernate,
				showLinkedAccount: this.options.showLinkedAccount,
				onChange: this.options.onChange
			}; 
		},

		onRender: function() {

			// remove broken rows and shout out the indicies
			//
			this.$el.find('table').find('tbody tr').each( 
				function(index){
					if ($(this).children().length === 0) {
						// console.log(index);
						$(this).remove(); 
					}
				} 
			);

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// call superclass method
			//
			SortableTableListView.prototype.onRender.call(this);
		},

		//
		// event handling methods
		//

		onClickForcePasswordResetSelectAll: function(event) {
			var self = this;

			if ($(event.target).prop('checked')) {
				Registry.application.modal.show(
					new ConfirmView({
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
					})
				);
			} else {
				Registry.application.modal.show(
					new ConfirmView({
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
					})
				);
			}

			this.options.onChange();
		},

		onClickHibernateSelectAll: function(event) {
			var self = this;

			if ($(event.target).prop('checked')) {
				Registry.application.modal.show(
					new ConfirmView({
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
					})
				);
			} else {
				Registry.application.modal.show(
					new ConfirmView({
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
					})
				);
			}

			this.options.onChange();
		}
	});
});
