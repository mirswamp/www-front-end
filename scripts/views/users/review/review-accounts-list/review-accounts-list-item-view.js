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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'dropdown',
	'text!templates/users/review/review-accounts-list/review-accounts-list-item.tpl',
	'config',
	'registry',
	'utilities/time/date-format',
	'views/dialogs/error-view',
	'views/dialogs/notify-view',
	'views/dialogs/confirm-view',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Dropdown, Template, Config, Registry, DateFormat, ErrorView, NotifyView, ConfirmView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click .force-password-reset': 'onClickForcePasswordReset',
			'click .hibernate': 'onClickHibernate',
			'click a.pending': 'onClickPending',
			'click a.enabled': 'onClickEnabled',
			'click a.disabled': 'onClickDisabled',
			'click a.owner-pending': 'onClickOwnerPending',
			'click a.owner-approved': 'onClickOwnerApproved',
			'click a.owner-denied': 'onClickOwnerDenied'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				config: Registry.application.config,
				index: this.options.index + 1,
				url: Registry.application.getURL() + '#accounts/' + this.model.get('user_uid'),
				showForcePasswordReset: this.options.showForcePasswordReset,
				showHibernate: this.options.showHibernate,
				showLinkedAccount: this.options.showLinkedAccount,
				showNumbering: this.options.showNumbering
			}));
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

		onClickOwnerPending: function() {
			this.model.setOwnerStatus('pending');
			this.onChange();
		},

		onClickEnabled: function() {
			this.model.setStatus('enabled');
			this.onChange();
		},

		onClickOwnerApproved: function() {
			this.model.setOwnerStatus('approved');
			this.onChange();
		},

		onClickDisabled: function() {
			this.model.setStatus('disabled');
			this.onChange();
		},

		onClickOwnerDenied: function() {
			this.model.setOwnerStatus('denied');
			this.onChange();
		},

		onClickDelete: function() {
			var self = this;

			// show confirm delete dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
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
								Registry.application.modal.show(
									new NotifyView({
										message: "This user account has been successfuly disabled."
									})
								);
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this user account."
									})
								);
							}
						});
					}
				})
			);
		}
	});
});
