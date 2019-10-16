/******************************************************************************\
|                                                                              |
|                          packages-list-item-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single item belonging to         |
|        a list of packages.                                                   |
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
	'text!templates/packages/list/packages-list-item.tpl',
	'collections/projects/projects',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-format'
], function($, _, Template, Projects, TableListItemView, DateFormat) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				index: this.options.index + 1,
				url: application.session.user? '#packages/' + this.model.get('package_uuid'): undefined,
				showDeactivatedPackages: this.options.showDeactivatedPackages,
				showNumbering: this.options.showNumbering,
				showProjects: this.options.showProjects,
				showDelete: this.options.showDelete
			};
		},

		projectsToHtml: function(collection) {
			var html = '';
			for (var i = 0; i < collection.length; i++) {
				var project = collection.at(i);
				if (i > 0) {
					html += ', <br />';
				}
				html += '<a href="#projects/' + project.get('project_uid') + '" target="blank">' + project.get('full_name') +'</a>';
			}
			return html;
		},

		onRender: function() {
			if (this.options.showProjects) {
				this.showProjects();
			}
		},

		showProjects: function() {
			var self = this;

			// fetch projects shared with package
			//
			new Projects().fetchByPackage(this.model, {

				// callbacks
				//
				success: function(collection) {

					// add projects to list item
					//
					self.$el.find('.projects').html(self.projectsToHtml(collection));
				}
			});	
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Package",
				message: "Are you sure that you would like to delete package " + self.model.get('name') + "? " +
					"All versions of this package and any scheduled assessments using this package will be deleted. Existing assessment results will not be deleted.",

				// callbacks
				//
				accept: function() {

					// delete user
					//
					self.model.destroy({

						// callbacks
						//
						success: function() {

							// return to packages view
							//
							Backbone.history.navigate('#packages', {
								trigger: true
							});
						},

						error: function() {

							// show error message
							//
							application.error({
								message: 'Could not delete this package.'
							});
						}
					});
				}
			});
		}
	});
});
