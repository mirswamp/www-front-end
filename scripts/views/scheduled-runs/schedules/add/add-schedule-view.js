/******************************************************************************\
|                                                                              |
|                                add-schedule-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for creating a new run request schedule.        |
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
	'text!templates/scheduled-runs/schedules/add/add-schedule.tpl',
	'models/run-requests/run-request',
	'models/run-requests/run-request-schedule',
	'collections/run-requests/run-requests',
	'collections/run-requests/run-request-schedules',
	'views/base-view',
	'views/scheduled-runs/schedules/profile/schedule-profile-form-view',
	'views/scheduled-runs/schedules/schedule/editable-run-request-schedule-list/editable-run-request-schedule-list-view'
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
			'input input, textarea': 'onChangeInput',
			'keyup input, textarea': 'onChangeInput',
			'click #add-request': 'onClickAddRequest',
			'click #save:disabled': 'onClickSaveDisabled',
			'click #save:not(:disabled)': 'onClickSave',
			'click #cancel': 'onClickCancel',
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;

			this.model = new RunRequest({
				'project_uuid': this.options.project.get('project_uid')
			});
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
		// querying methods
		//

		getQueryString: function() {
			var queryString = '';

			if (this.options.project && !this.options.project.isTrialProject()) {
				queryString = addQueryString(queryString, 'project=' + this.options.project.get('project_uid'));
			}
			if (this.options.assessmentRunUuids) {
				queryString = addQueryString(queryString, 'assessments=' + this.options.assessmentRunUuids);
			}

			return queryString;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
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

					// show schedule form
					//
					self.showChildView('form', new ScheduleProfileFormView({
						model: self.model,
						collection: runRequests
					}));
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch project's run requests."
					});
				}
			});	

			// show schedule items list
			//
			this.showChildView('list', new EditableRunRequestScheduleListView({
				collection: this.collection,
				showDelete: true
			}));

			// if empty list
			//
			if (self.collection.length === 0) {

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);
			}
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

				// save new schedule
				//
				this.model.save(undefined, {

					// callbacks
					//
					success: function() {

						// set run request uuid of each model in collection
						//
						for (var i = 0; i < self.collection.length; i++) {
							self.collection.at(i).set({
								'run_request_uuid': self.model.get('run_request_uuid')
							});
						}

						// save run request schedule items
						//
						self.collection.save({
							type: 'POST',
							
							// callbacks
							//
							success: function() {
								self.onClickCancel();
							},

							error: function() {

								// show error view
								//
								application.error({
									message: "Could not save schedule items."
								});
							}
						});
					},

					error: function() {

						// show error view
						//
						application.error({
							message: "Could not save this run request schedule."
						});
					}
				});
			}
		},

		onClickCancel: function() {
			var queryString = this.getQueryString();

			if (this.options.assessmentRunUuids) {

				// go to add run requests view
				//
				Backbone.history.navigate('#run-requests/add' + (queryString != ''? '?' + queryString : ''), {
					trigger: true
				});
			} else {

				// go to run request schedules view
				//
				Backbone.history.navigate('#run-requests/schedules' + (queryString != ''? '?' + queryString : ''), {
					trigger: true
				});
			}
		}
	});
});
