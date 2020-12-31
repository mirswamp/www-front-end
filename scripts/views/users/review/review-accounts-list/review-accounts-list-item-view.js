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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/dropdown',
	'text!templates/users/review/review-accounts-list/review-accounts-list-item.tpl',
	'models/users/user-info',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-format',
	'utilities/time/date-utils'
], function($, _, Dropdown, Template, UserInfo, TableListItemView, DateFormat) {
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
				name: this.model.getFullName(),
				url: this.model.getAppUrl(),
				status: this.model.getStatus(),
				isEnabled: this.model.isEnabled(),
				
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

		onRender: function() {
			
			// call superclass method
			//
			TableListItemView.prototype.onRender.call(this);

			// show additional statistical info
			//
			if (this.options.showStats) {
				this.fetchAndShowStats();
			}
		},

		fetchAndShowStats: function() {
			var self = this;
			new UserInfo({
				user_uid: this.model.get('user_uid')
			}).fetch({

				// callbacks
				//
				success: function(data) {	
					self.showStats(data);
				}
			});	
		},

		showStats: function(info) {
			var numPackages = info.get('num_packages');
			var numProjects = info.get('num_projects');
			var numRuns = info.get('num_executions');
			var numResults = info.get('num_results');
			var successRate = numRuns != 0? Math.round(numResults / numRuns * 100) : undefined;

			// update list item
			//
			this.$el.find('.num-packages').text(numPackages);
			this.$el.find('.num-projects').text(numProjects);
			this.$el.find('.num-runs').text(numRuns);
			this.$el.find('.num-results').text(numResults);

			if (successRate != undefined) {
				this.$el.find('.success-rate').text(successRate.toString() + '%');

				if (successRate > 50) {
					this.$el.find('.success-rate').addClass('success');
				} else {
					this.$el.find('.success-rate').addClass('error');
				}
			}

			// update list when entirely loaded
			//
			this.options.parent.count++;
			if (this.options.parent.count == this.options.parent.collection.length) {
				this.options.parent.update();
			}
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
