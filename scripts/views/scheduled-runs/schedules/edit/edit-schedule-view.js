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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/scheduled-runs/schedules/edit/edit-schedule.tpl',
	'registry',
	'models/run-requests/run-request',
	'models/run-requests/run-request-schedule',
	'collections/run-requests/run-requests',
	'collections/run-requests/run-request-schedules',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/scheduled-runs/schedules/profile/schedule-profile-form-view',
	'views/scheduled-runs/schedules/edit/editable-run-request-schedules-list/editable-run-request-schedules-list-view'
], function($, _, Backbone, Marionette, Template, Registry, RunRequest, RunRequestSchedule, RunRequests, RunRequestSchedules, NotifyView, ErrorView, ScheduleProfileFormView, EditableRunRequestSchedulesListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			scheduleProfileForm: '#schedule-profile-form',
			scheduleItemsList: '#schedule-items-list'
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
		// methods
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				project: this.options.project
			}));
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
					self.scheduleProfileForm.show(
						new ScheduleProfileFormView({
							model: self.model,
							collection: runRequests
						})
					);
				},

				error: function() {

					// show error view
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch project's run requests."
						})
					);		
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
					self.scheduleItemsList.show(
						new EditableRunRequestSchedulesListView({
							collection: self.collection,
							showDelete: true
						})
					);

					// enable or disable save button
					//
					if (self.collection.length === 0) {
						self.disableSaveButton();
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch items for this schedule."
						})
					);
				}
			});
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
			this.scheduleItemsList.currentView.render();
		},

		onClickSaveDisabled: function() {

			// show notification dialog
			//
			Registry.application.modal.show(
				new NotifyView({
					message: "You must add one or more run requests before you can save a schedule."
				})
			);			
		},

		onClickSave: function() {
			var self = this;

			// check validation
			//
			if (this.scheduleProfileForm.currentView.isValid() && 
				this.scheduleItemsList.currentView.isValid()) {

				// update model from form
				//
				this.scheduleProfileForm.currentView.update(this.model);

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

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not save schedule items."
									})
								);						
							}
						})
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not save this run request schedule."
							})
						);
					}
				});
			}
		},

		onClickCancel: function() {

			// go to run request schedules view
			//
			Backbone.history.navigate('#run-requests/schedules/' + this.model.get('run_request_uuid'), {
				trigger: true
			});
		}
	});
});