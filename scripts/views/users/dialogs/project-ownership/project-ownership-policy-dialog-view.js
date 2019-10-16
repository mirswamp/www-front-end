/******************************************************************************\
|                                                                              |
|                    project-ownership-policy-dialog-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box for displaying the project ownership        |
|        policy.                                                               |
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
	'text!templates/users/dialogs/project-ownership/project-ownership-policy-dialog.tpl',
	'text!templates/policies/project-ownership-policy.tpl',
	'views/dialogs/dialog-view',
], function($, _, Template, ProjectOwnershipPolicyTemplate, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #accept-project-ownership-policy': 'onClickAcceptProjectOwnershipPolicy',
			'click #cancel-project-ownership-policy': 'onClickCancelProjectOwnershipPolicy',
		},

		onRender: function() {

			// show subview
			//
			this.$el.find('#project-ownership-policy-text').html(_.template(ProjectOwnershipPolicyTemplate));
		},

		//
		// event handling methods
		//

		onClickAcceptProjectOwnershipPolicy: function() {
			this.model.save( undefined, {
				success: function() {

					// show success notification message
					//
					application.notify({
						title: "Request Sent",
						message: "You will be notified when ownership privileges are granted.",
						
						// callbacks
						//
						accept: function() {
							Backbone.history.loadUrl();
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not request ownership privileges."
					});
				},
			});
		},

		onClickCancelProjectOwnershipPolicy: function() {
			if (this.options.reject) {
				this.options.reject();
			}
		}
	});
});
