/******************************************************************************\
|                                                                              |
|                            schedule-run-requests-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for defining the schedule of an assesment.      |
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
	'text!templates/scheduled-runs/schedule-run-requests/schedule-run-requests.tpl',
	'models/run-requests/run-request',
	'collections/run-requests/run-requests',
	'views/base-view',
	'views/scheduled-runs/schedules/select-list/select-schedules-list-view'
], function($, _, Template, RunRequest, RunRequests, BaseView, SelectSchedulesListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#select-schedules-list'
		},

		events: {
			'click #add-new-schedule': 'onClickAddNewSchedule',
			'click #schedule-assessments': 'onClickScheduleAssessments',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new RunRequests();

			// parse assessment run uuids
			//
			this.assessmentRunUuids = this.options.data['assessments'].split('+');
		},

		//
		// methods
		//

		saveRunRequest: function(runRequest) {
			var self = this;
			var notifyWhenComplete = this.$el.find('#notify').is(':checked');

			// save run requests
			//
			runRequest.saveRunRequests(this.assessmentRunUuids, notifyWhenComplete, {

				// callbacks
				//
				success: function() {

					// remove assessment run uuids from query string
					//
					if (self.options.data['assessments']) {
						self.options.data['assessments'] = null;
					}
					var queryString = self.getQueryString();

					// go to run requests view
					//
					Backbone.history.navigate('#run-requests' + (queryString != ''? '?' + queryString : ''), {
						trigger: true
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save collection of run request assocs."
					});
				}
			});
		},

		//
		// querying methods
		//

		getQueryString: function() {
			var queryString = '';

			if (this.model && !this.model.isTrialProject()) {
				queryString = addQueryString(queryString, 'project=' + this.model.get('project_uid'));
			}
			if (this.options.data['package']) {
				queryString = addQueryString(queryString, 'package=' + this.options.data['package'].get('package_uuid'));
			}
			if (this.options.data['tool']) {
				queryString = addQueryString(queryString, 'tool=' + this.options.data['tool'].get('tool_uuid'));
			}
			if (this.options.data['platform']) {
				queryString = addQueryString(queryString, 'platform=' + this.options.data['platform'].get('platform_uuid'));
			}
			if (this.options.data['assessments']) {
				queryString = addQueryString(queryString, 'assessments=' + this.options.data['assessments']);
			}

			return queryString;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				numberOfAssessments: this.assessmentRunUuids.length,
				config: application.config
			};
		},

		onRender: function() {
			var self = this;

			// fetch collection of run requests
			//
			this.collection.fetchByProject(this.model, {

				// callbacks
				//
				success: function() {
					self.showList();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch collection of run requests."
					});
				}
			});
		},

		showList: function() {

			// show select schedules list view
			//
			this.showChildView('list', new SelectSchedulesListView({
				collection: this.collection,
				showDelete: true
			}));	
		},

		//
		// event handling methods
		//

		onClickAddNewSchedule: function() {
			var queryString = this.getQueryString();

			// go to add schedule view
			//
			Backbone.history.navigate('#run-requests/schedules/add' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		},

		onClickScheduleAssessments: function() {
			var selectedRunRequest = this.getChildView('list').getSelected();
			if (selectedRunRequest) {
				this.saveRunRequest(selectedRunRequest);
			} else {
				
				// show notification
				//
				application.notify({
					message: "You must select a schedule."
				});
			}
		},

		onClickCancel: function() {
			var queryString = this.getQueryString();

			// go to my assessments view
			//
			Backbone.history.navigate('#assessments' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		}
	});
});