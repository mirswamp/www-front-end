/******************************************************************************\
|                                                                              |
|                      review-accounts-list-item-view.js                       |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/dropdown',
	'text!templates/users/review/review-accounts-list/review-accounts-list-item.tpl',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-format',
	'utilities/time/date-utils'
], function($, _, Dropdown, Template, TableListItemView, DateFormat) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .force-password-reset': 'onClickForcePasswordReset',
			'click .hibernate': 'onClickHibernate',
			'click a.pending': 'onClickPending',
			'click a.enabled': 'onClickEnabled',
			'click a.disabled': 'onClickDisabled'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				config: application.config,
				index: this.options.index + 1,
				url: application.getURL() + '#accounts/' + this.model.get('user_uid'),
				showForcePasswordReset: this.options.showForcePasswordReset,
				showHibernate: this.options.showHibernate,
				showLinkedAccount: this.options.showLinkedAccount,
				showNumbering: this.options.showNumbering
			};
		},

		//
		// event handling methods
		//

		onChange: function() {
			this.render();

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onClickForcePasswordReset: function() {
			this.model.setForcePasswordReset(!this.model.isPasswordResetRequired());
			this.onChange();
		},

		onClickHibernate: function() {
			this.model.setHibernating(!this.model.isHibernating());
			this.onChange();
		},

		onClickPending: function() {
			this.model.setStatus('pending');
			this.onChange();
		},

		onClickEnabled: function() {
			this.model.setStatus('enabled');
			this.onChange();
		},

		onClickDisabled: function() {
			this.model.setStatus('disabled');
			this.onChange();
		},

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete User Account",
				message: "Are you sure that you would like to delete " +
					this.model.getFullName() + "'s user account? " +
					"When you delete an account, all of the user data will continue to be retained.",

				// callbacks
				//
				accept: function() {
					self.model.setStatus('disabled');

					// update view
					//
					self.render();

					// save user
					//
					self.model.save(undefined, {

						// callbacks
						//
						success: function() {
							self.onChange();

							// show success notification dialog
							//
							application.notify({
								message: "This user account has been successfuly disabled."
							});
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this user account."
							});
						}
					});
				}
			});
		}
	});
});
