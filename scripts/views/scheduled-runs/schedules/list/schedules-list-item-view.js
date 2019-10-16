/******************************************************************************\
|                                                                              |
|                          schedules-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single schedule item.               |
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
	'text!templates/scheduled-runs/schedules/list/schedules-list-item.tpl',
	'models/run-requests/run-request',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, RunRequest, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// querying methods
		//

		getUrl: function() {
			if (this.model.has('project_uuid')) {
				return '#run-requests/schedules/' + this.model.get('run_request_uuid');
			}
		},

		//
		// rendering methods
		//

		templateContext: function(data) {
			return {
				index: this.options.index + 1,
				url: this.getUrl(),
				projectUrl: '#projects/' + this.model.get('project_uuid'),
				showNumbering: this.options.showNumbering,
				showProjects: this.options.showProjects,
				showDelete: this.options.showDelete
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

							// show error message
							//
							application.error({
								message: "Could not delete this run request schedule."
							});
						}
					});
				}
			});
		}
	});
});