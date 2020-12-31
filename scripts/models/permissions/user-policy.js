/******************************************************************************\
|                                                                              |
|                                user-policy.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user policy which tells whether or          |
|        no a user has accepted a particular policy.                           |
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
	'config',
	'models/utilities/timestamped',
	'models/permissions/policy'
], function($, _, Config, Timestamped, Policy) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		urlRoot: Config.servers.web + '/user_policies',

		//
		// policy confirmation methods
		//

		showConfirmDialog: function(options) {
			var self = this;
			require([
				'views/policies/dialogs/accept-policy-dialog-view'
			], function (AcceptPolicyDialogView) {
				application.show(new AcceptPolicyDialogView({
					title: options.description,
					message: "You must first read and accept the following policy:",
					policy: options.policy,
					
					// callbacks
					//
					accept: function() {
						self.accept(options);
					},

					reject: function() {

						// perform callback
						//
						if (options && options.reject) {
							options.reject();
						}
					}
				}), {
					size: 'large'
				});
			});
		},

		confirmPolicy: function(options) {
			var self = this;

			// fetch policy
			//
			new Policy({
				policy_code: this.get('policy_code')
			}).fetch({

				// callbacks
				//
				success: function(policy) {

					// show confirm tool policy dialog
					//
					self.showConfirmDialog({
						description: policy.get('description'),
						policy_code: policy.get('policy_code'),
						policy: policy.get('policy'),

						// callbacks
						//
						success: function() {

							// perform callback
							//
							if (options && options.success) {
								options.success();
							}
						},

						reject: function() {

							// perform callback
							//
							if (options && options.reject) {
								options.reject();
							}		
						},

						error: function(response) {

							// show error message
							//
							application.error({
								message: "Error saving policy acknowledgement."
							});
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch policy."
					});	
				}
			});
		},

		confirm: function(options) {
			var self = this;

			// fetch tool policy text
			//
			this.fetchStatus({

				// callbacks
				//
				success: function(status) {

					switch (status) {
						case 'accepted':

							// perform callback
							//
							if (options && options.success) {
								options.success();
							}
							return;

						case 'not_accepted':

							// prompt user to accept policy
							//
							self.confirmPolicy(options);
							break;
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch user policy status."
					});
				}
			});
		},

		//
		// ajax methods
		//

		fetchStatus: function(options) {
			$.ajax(_.extend(options, {
				type: 'GET',
				url: this.urlRoot + '/' + this.get('policy_code'),
			}));
		},

		accept: function(options) {
			$.ajax({
				url: this.urlRoot + '/' + this.get('policy_code') + '/user/' + application.session.user.get('user_uid'),
				data: {
					accept_flag: 1
				},
				type: 'POST',
				dataType: 'JSON',

				// callbacks
				//
				success: function(response) {

					// perform callback
					//
					if (options && options.success) {
						options.success(response);
					}
				},

				error: function(response) {

					// perform callback
					//
					if (options && options.error) {
						options.error(response);
					}
				}
			});
		}
	});
});