/******************************************************************************\
|                                                                              |
|                         project-members-list-item-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a list of project members.          |
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
	'backbone',
	'marionette',
	'text!templates/projects/info/members/list/project-members-list-item.tpl',
	'config',
	'registry',
	'utilities/time/date-format',
	'models/users/user',
	'views/dialogs/error-view',
	'views/dialogs/confirm-view',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Template, Config, Registry, DateFormat, User, ErrorView, ConfirmView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click .delete button': 'onClickDelete',
			'click .admin input': 'onClickAdminCheckbox'
		},

		//
		// rendering methods
		//

		template: function(data) {
			var isAdmin = Registry.application.session.isAdmin();
			var isOwner = this.options.project.isOwnedByMember(this.options.projectMembership);
			var myMembership = this.options.projectMembership.belongsTo(Registry.application.session.user);

			return _.template(Template, _.extend(data, {
				User: User,
				model: this.model,
				index: this.options.index + 1,
				project: this.options.project,
				projectMembership: this.options.projectMembership,
				showEmail: this.options.showEmail,
				showUsername: this.options.showUsername,
				showDelete: (this.options.showDelete || myMembership || isAdmin) && !isOwner,
				showNumbering: this.options.showNumbering,
				readOnly: this.options.readOnly || isOwner
			}));
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Project Member",
					message: "Are you sure that you want to delete " + this.model.getFullName() + " from the project, " + this.options.project.get('full_name') + "?",

					// callbacks
					//
					accept: function() {
						var myMembership = self.options.projectMembership.belongsTo(Registry.application.session.user);
						self.options.projectMembership.destroy({

							// callbacks
							//
							success: function() {

								// remove user
								//
								self.collection.remove(self.model);

								// check if we are removing ourselves
								//
								if (myMembership) {
									
									// go to projects view
									//
									Backbone.history.navigate('#projects', {
										trigger: true
									});
								}
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this project membership."
									})
								);
							}
						});
					}
				})
			);
		},

		onClickAdminCheckbox: function(event) {
			var isChecked = ($(event.currentTarget).is(':checked'));

			// update admin flag
			//
			this.options.projectMemberships.at(this.options.index).setAdmin(isChecked);
		}
	});
});
