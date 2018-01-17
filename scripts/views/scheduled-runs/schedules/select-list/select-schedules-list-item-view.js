/******************************************************************************\
|                                                                              |
|                          select-schedules-list-item-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single selectable schedule item.    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/scheduled-runs/schedules/select-list/select-schedules-list-item.tpl',
	'registry',
	'models/run-requests/run-request',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Template, Registry, RunRequest, ConfirmView, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				itemIndex: this.options.itemIndex,
				url: data.project_uuid !== ''? '#run-requests/schedules/' + this.model.get('run_request_uuid') + '/edit' + 
				(this.options.selectedAssessmentRunUuids? '/' + this.options.selectedAssessmentRunUuids : '') : null,
				showDelete: this.options.showDelete
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
					title: "Delete Schedule",
					message: "Are you sure that you want to delete this " + self.model.get('name') + " schedule from this project?",

					// callbacks
					//
					accept: function() {
						var runRequest = new RunRequest();
						self.model.url = runRequest.url;

						self.model.destroy({

							// callbacks
							//
							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this run request schedule."
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