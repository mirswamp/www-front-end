/******************************************************************************\
|                                                                              |
|                         review-projects-list-item-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single item belonging to         |
|        a list of projects for review.                                        |
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
	'text!templates/projects/review/review-projects-list/review-projects-list-item.tpl',
	'views/projects/list/projects-list-item-view',
	'utilities/time/date-format',
	'utilities/time/date-utils'
], function($, _, Dropdown, Template, ProjectsListItemView) {
	return ProjectsListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		
		events: {
			'click .deactivated': 'onClickDeactivated',
			'click .activated': 'onClickActivated'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				collection: this.collection,
				config: application.config,
				index: this.options.index + 1,
				url: application.getURL() + '#projects/' + this.model.get('project_uid'),
				showDeactivatedProjects: this.options.showDeactivatedProjects,
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

		onClickActivated: function() {
			this.model.setStatus('activated');
			this.onChange();
		},

		onClickDeactivated: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Deactivate Project",
				message: "Are you sure you want to deactivate project " + this.model.get('full_name') + "?",

				// callbacks
				//
				accept: function() {
					self.model.destroy({

						// callbacks
						//
						success: function(child, response) {

							// add the updated model back into the collection
							//
							self.model.set({ 
								deactivation_date: new Date(response.deactivation_date.replace(' ', 'T'))
							});
							self.options.collection.add(self.model);
							self.options.parent.render();
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this project."
							});
						}
					});
				}
			});
		}
	});
});
