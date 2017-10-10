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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/dropdown',
	'text!templates/projects/review/review-projects-list/review-projects-list-item.tpl',
	'registry',
	'utilities/time/date-format',
	'views/dialogs/error-view',
	'views/dialogs/notify-view',
	'views/dialogs/confirm-view',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Dropdown, Template, Registry, DateFormat, ErrorView, NotifyView, ConfirmView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',
		
		events: {
			'click .deactivated': 'onClickDeactivated',
			'click .activated': 'onClickActivated'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				collection: this.collection,
				config: Registry.application.config,
				index: this.options.index + 1,
				url: Registry.application.getURL() + '#projects/' + this.model.get('project_uid'),
				showDeactivatedProjects: this.options.showDeactivatedProjects,
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

		onClickActivated: function() {
			this.model.setStatus('activated');
			this.onChange();
		},

		onClickDeactivated: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
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

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this project."
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
