/******************************************************************************\
|                                                                              |
|                            projects-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single item belonging to         |
|        a list of projects.                                                   |
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
	'text!templates/projects/list/projects-list-item.tpl',
	'utilities/time/date-format',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-utils'
], function($, _, Template, DateFormat, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// methods
		//

		deleteProject: function() {
			var self = this;
			this.model.destroy({

				// callbacks
				//
				success: function() {

					// remove model from collection
					//
					self.options.parent.collection.remove(self.model);

					// update user
					//
					application.session.user.set('num_projects', application.session.user.get('num_projects') - 1);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not delete this project."
					});
				}
			});
		},

		deleteProjectMembership: function() {
			var self = this;
			this.model.deleteCurrentMember({

				// callbacks
				//
				success: function() {

					// refresh parent
					//
					self.options.parent.collection.remove(self.model);
					self.options.parent.render();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not delete this project member."
					});
				}
			});	
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				url: this.model.getAppUrl(),
				isDeactivated: this.model.isDeactivated(),
				showDeactivatedProjects: this.options.showDeactivatedProjects,
				showDelete: this.options.showDelete && this.model.isOwnedBy(application.session.user) && !this.model.isTrialProject()
			};
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;
			if (this.model.isOwnedBy(application.session.user)) {
			
				// show confirmation
				//
				application.confirm({
					title: "Delete Project",
					message: "Are you sure that you would like to delete project " + self.model.get('full_name') + "? " +
						"When you delete a project, all of the project data will continue to be retained.",

					// callbacks
					//
					accept: function() {
						self.deleteProject();
					}
				});
			} else {

				// show confirmation
				//
				application.confirm({
					title: "Delete Project Membership",
					message: "Are you sure that you would like to delete your membership from project " + self.model.get('full_name') + "? ",

					// callbacks
					//
					accept: function() {
						self.deleteProjectMembership();
					}
				});
			}
		},
	});
});
