/******************************************************************************\
|                                                                              |
|                                edit-schedule-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a run request schedule.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/schedules/edit/edit-schedule.tpl',
	'models/run-requests/run-request',
	'models/run-requests/run-request-schedule',
	'collections/run-requests/run-requests',
	'collections/run-requests/run-request-schedules',
	'views/base-view',
	'views/schedules/profile/schedule-profile-form-view',
	'views/schedules/schedule/editable-run-request-schedule-list/editable-run-request-schedule-list-view'
], function($, _, Template, RunRequest, RunRequestSchedule, RunRequests, RunRequestSchedules, BaseView, ScheduleProfileFormView, EditableRunRequestScheduleListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#schedule-profile-form',
			list: '#schedule-items-list'
		},

		events: {
			'change input, textarea, select': 'onChangeInput',
			'keyup input, textarea, select': 'onChangeInput',
			'click #add-request': 'onClickAddRequest',
			'click #save.disabled': 'onClickSaveDisabled',
			'click #save:not(.disabled)': 'onClickSave',
			'click #cancel': 'onClickCancel',
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;
			this.collection = new RunRequestSchedules();

			// set item remove callback
			//
			this.collection.bind('remove', function() {

				// if empty list
				//
				if (self.collection.length === 0) {

					// disable save button
					//
					self.$el.find('#save').prop('disabled', true);
				}
			}, this);
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				project: this.options.project
			};
		},

		onRender: function() {
			var self = this;

			// fetch project's existing schedules
			//
			var runRequests = new RunRequests();
			runRequests.fetchByProject(this.options.project, {

				// callbacks
				//
				success: function() {

					// show schedule profile form
					//
					self.showChildView('form', new ScheduleProfileFormView({
						model: self.model,
						collection: runRequests
					}));
				},

				error: function() {

					// show error view
					//
					application.error({
						message: "Could not fetch project's run requests."
					});
				}
			});	

			// get schedule items
			//
			this.collection.fetchByRunRequest(this.model, {

				// callbacks
				//
				success: function() {

					// show schedule items list
					//
					self.showChildView('list', new EditableRunRequestScheduleListView({
						collection: self.collection,
						showDelete: true,

						// callbacks
						//
						onChange: function() {
							self.onChangeInput();
						}
					}));

					// enable or disable save button
					//
					if (self.collection.length === 0) {
						self.disableSaveButton();
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch items for this schedule."
					});
				}
			});
		},

		disableSaveButton: function() {

			// disable save button
			//
			this.$el.find('#save').prop('disabled', true);
		},

		//
		// event handling methods
		//

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickAddRequest: function() {
			this.collection.add(
				new RunRequestSchedule({
					'run_request_uuid': this.model.get('run_request_uuid'),
					'recurrence_type': 'daily'
				})
			);

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);

			// update view
			//
			this.getChildView('list').render();
		},

		onClickSaveDisabled: function() {

			// show notification
			//
			application.notify({
				message: "You must add one or more run requests before you can save a schedule."
			});
		},

		onClickSave: function() {
			var self = this;

			// check validation
			//
			if (this.getChildView('form').isValid() && 
				this.getChildView('list').isValid()) {

				// update model from form
				//
				this.getChildView('form').applyTo(this.model);

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);

				// save new project
				//
				this.model.save(undefined, {

					// callbacks
					//
					success: function() {

						// save run request schedule items
						//
						self.collection.save({
							
							// callbacks
							//
							success: function() {
								self.onClickCancel();
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not save schedule items."
								});
							}
						});
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not save this run request schedule."
						});
					}
				});
			}
		},

		onClickCancel: function() {

			// go to run request schedules view
			//
			application.navigate('#run-requests/schedules/' + this.model.get('run_request_uuid'));
		}
	});
});