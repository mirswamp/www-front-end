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
	'text!templates/projects/info/members/list/project-members-list-item.tpl',
	'utilities/time/date-format',
	'models/users/user',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-utils'
], function($, _, Template, DateFormat, User, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete',
			'click .admin input': 'onClickAdminCheckbox'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			var isAdmin = application.session.isAdmin();
			var isOwner = this.options.project.isOwnedBy(this.model.get('user'));
			var myMembership = this.model.get('user').isCurrentUser();

			return {
				index: this.options.index + 1,
				project: this.options.project,
				showEmail: this.options.showEmail,
				showUsername: this.options.showUsername,
				showDelete: (this.options.showDelete || myMembership || isAdmin) && !isOwner,
				showNumbering: this.options.showNumbering,
				readOnly: this.options.readOnly || isOwner
			};
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Project Member",
				message: "Are you sure that you want to delete " + this.model.get('user').getFullName() + " from the project, " + this.options.project.get('full_name') + "?",

				// callbacks
				//
				accept: function() {
					var myMembership = self.model.belongsTo(application.session.user);
					self.model.destroy({

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

							// show error message
							//
							application.error({
								message: "Could not delete this project membership."
							});
						}
					});
				}
			});
		},

		onClickAdminCheckbox: function(event) {
			var isChecked = ($(event.currentTarget).is(':checked'));

			// update admin flag
			//
			this.model.setAdmin(isChecked);
		}
	});
});
