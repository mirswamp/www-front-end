/******************************************************************************\
|                                                                              |
|                              results-router.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for results routes.          |
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
	'backbone'
], function($, _, Backbone) {

	//
	// local variables
	//

	var refreshInterval = 3000;

	//
	// local methods
	//

	function showResultsData(data) {

		// display results in new window
		//
		if (data.results) {

			// insert results into DOM
			//
			window.document.write(data.results);

			// call window onload, if there is one
			//
			if (window.onload) {
				window.onload();
			}
		} else if (data.results_url) {
			window.location = data.results_url;
		}
	}

	// create router
	//
	return Backbone.Router.extend({

		//
		// route definitions
		//

		routes: {

			// result administration routes
			//
			'results/review(?*query_string)': 'showReviewResults',

			// assessment results routes
			//
			'results/:assessment_results_uid/viewer/:viewer_uuid/project/:project_uuid': 'showAssessmentResultsViewer',
			'results/delete(?*query_string)': 'showDeleteAssessmentsResults',
			'results(?*query_string)': 'showAssessmentsResults',
			
			// assessment run and result routes
			//
			'runs/:execution_record_uuid/status(?*query_string)': 'showAssessmentRunStatus',
			'projects/:project_uid/results': 'showAssessmentResults'
		},

		//
		// result administration route handlers
		//

		showReviewResults: function(queryString) {
			require([
				'registry',
				'routers/query-string-parser',
				'views/assessment-results/assessment-runs/review/review-results-view'
			], function (Registry, QueryStringParser, ReviewResultsView) {
				
				// show content view
				//
				Registry.application.showContent({
					'nav1': 'home',
					'nav2': 'overview', 

					// callbacks
					//
					done: function(view) {
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {

							// show review results view
							//
							view.content.show(
								new ReviewResultsView({
									data: data
								})
							);
						});
					}
				});
			});
		},

		//
		// assessment results route handlers
		//

		showAssessmentResultsViewer: function(assessmentResultUuid, viewerUuid, projectUuid) {
			require([
				'jquery',
				'underscore',
				'text!templates/viewers/progress.tpl',
				'registry',
				'models/assessments/assessment-results',
				'views/dialogs/error-view'
			], function ($, _, Template, Registry, AssessmentResults, ErrorView) {

				// get assessment results
				//
				var assessmentResults = new AssessmentResults({
					assessment_result_uuid: assessmentResultUuid
				});

				var lastStatus = '';

				// call stored procedure
				//
				var getResults = function() {
					var options = {
						timeout: 0,

						// callbacks
						//
						success: function(data) {
							if (data.results_status === 'SUCCESS') {

								// display results in new window
								//
								showResultsData(data);
							} else if(data.results_status === 'LOADING') {

								// display viewer status and call again until ready
								//
								var template = _.template(Template, {
									viewer_status: data.results_viewer_status
								});

								// don't redraw if same status
								//
								if (template != lastStatus) {
									$('body').html(template);
									lastStatus = template;
								}

								// re-fetch without launching the viewer
								//
								setTimeout(function() {
									getInstanceStatus(data.viewer_instance);
								}, refreshInterval);
							}
							else {
								// display results status error message
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Error fetching assessment results: " + data.results_status
									})
								);
							}
						},

						error: function(response) {
							require([
								'models/run-requests/run-request'
							], function (RunRequest) {

								// allow user to sign the EULA
								//
								var runRequest = new RunRequest({});
								runRequest.handleError(response);
							});
						}
					};

					assessmentResults.fetchResults(viewerUuid, projectUuid, options);
				};

				var getInstanceStatus = function(viewerInstanceUuid) {
					var options = {
						timeout: 0,

						// callbacks
						//
						success: function(data) {
							if (data.results_status === 'SUCCESS') {

								// display results in new window
								//
								showResultsData(data);
							} else if(data.results_status === 'LOADING') {

								// display viewer status and call again until ready
								//
								var template = _.template(Template, {
									viewer_status: data.results_viewer_status
								});

								// don't redraw if same status
								//
								if (template != lastStatus) {
									$('body').html(template);
									lastStatus = template;
								}

								// re-fetch without launching the viewer
								//
								setTimeout(function() {
									getInstanceStatus(data.viewer_instance)
								}, refreshInterval);
							}
							else {
								// display results status error message
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Error fetching assessment results: " + data.results_status
									})
								);
							}
						},

						error: function() {

							// show error dialog
							//
							Registry.application.modal.show(
								new ErrorView({
									message: "Could not fetch assessment results content."
								})
							);
						}
					};

					assessmentResults.fetchInstanceStatus(viewerInstanceUuid, options);
				};

				// start refreshing
				//
				getResults();
			});
		},

		showAssessmentsResults: function(queryString) {
			var self = this;
			require([
				'registry',
				'routers/query-string-parser',
				'collections/viewers/viewers',
				'views/dialogs/error-view',
				'views/assessment-results/assessments-results-view'
			], function (Registry, QueryStringParser, Viewers, ErrorView, AssessmentsResultsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'results', 

					// callbacks
					//
					done: function(view) {
					
						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {

							// fetch viewers
							//
							var viewers = new Viewers();
							viewers.fetchAll({

								// callbacks
								//
								success: function() {

									// show assessments results view
									//
									view.content.show(
										new AssessmentsResultsView({
											data: data,
											model: view.model,
											viewers: viewers
										})
									);
								},

								error: function() {

									// show error dialog
									//
									Registry.application.modal.show(
										new ErrorView({
											message: "Could not fetch project viewers."
										})
									);
								}
							});	
						});
					}
				});
			});
		},

		showDeleteAssessmentsResults: function(queryString) {
			var self = this;
			require([
				'registry',
				'routers/query-string-parser',
				'views/dialogs/error-view',
				'views/assessment-results/delete/delete-assessments-results-view'
			], function (Registry, QueryStringParser, ErrorView, DeleteAssessmentsResultsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'results', 

					// callbacks
					//
					done: function(view) {
					
						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {

							// show assessments results view
							//
							view.content.show(
								new DeleteAssessmentsResultsView({
									data: data,
									model: view.model,
								})
							);
						});
					}
				});
			});
		},

		//
		// project assessment run route handlers
		//

		showAssessmentRunStatus: function(executionRecordUuid, queryString) {
			var self = this;
			require([
				'registry',
				'models/projects/project',
				'models/assessments/execution-record',
				'views/assessment-results/assessment-runs/status/assessment-run-status-view',
				'views/dialogs/error-view'
			], function (Registry, Project, ExecutionRecord, AssessmentRunStatusView, ErrorView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'results', 

					// callbacks
					//
					done: function(view) {

						// get execution record
						//
						var executionRecord = new ExecutionRecord({
							execution_record_uuid: executionRecordUuid
						});

						executionRecord.fetch({

							// callbacks
							//
							success: function() {

								// fetch execution record's project
								//
								//
								var project = new Project({
									project_uid: executionRecord.get('project_uuid')
								});

								project.fetch({

									// callbacks
									//
									success: function() {

										// show assessment run view
										//
										view.content.show(
											new AssessmentRunStatusView({
												model: executionRecord,
												project: project,
												queryString: queryString
											})
										);
									},

									error: function() {

										// show error dialog
										//
										Registry.application.modal.show(
											new ErrorView({
												message: "Could not fetch execution record's project."
											})
										);
									}
								});
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not fetch execution record."
									})
								);
							}
						});
					}
				});
			});
		},

		//
		// project assessment results route handlers
		//

		showAssessmentResults: function(assessmentResultUuid) {
			require([
				'registry',
				'models/projects/project',
				'models/assessments/assessment-results',
				'views/assessment-results/assessment-results-view',
				'views/dialogs/error-view'
			], function (Registry, Project, AssessmentResults, AssessmentResultsView, ErrorView) {

				// get assessment results
				//
				var assessmentResults = new AssessmentResults({
					assessment_result_uuid: assessmentResultUuid
				});

				assessmentResults.fetch({

					// callbacks
					//
					success: function() {

						// fetch project
						//
						var project = new Project({
							project_uid: assessmentResults.get('project_uuid')
						});

						project.fetch({

							// callbacks
							//
							success: function() {

								// show assessment results view
								//
								Registry.application.showPage(
									new AssessmentResultsView({
										model: assessmentResults,
										project: project
									})
								);
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.showPage(
									new ErrorView({
										message: "Could not fetch project."
									})
								);
							}
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch assessment results."
							})
						);
					}
				});
			});
		},

		showEditAssessmentResults: function(assessmentResultUuid) {
			require([
				'registry',
				'models/projects/project',
				'models/assessments/assessment-results',
				'views/assessment-results/edit/edit-assessments-results-view',
				'views/dialogs/error-view'
			], function (Registry, Project, AssessmentResults, EditAssessmentResultsView, ErrorView) {

				// get assessment results
				//
				var assessmentResults = new AssessmentResults({
					assessment_result_uuid: assessmentResultUuid
				});

				assessmentResults.fetch({

					// callbacks
					//
					success: function() {

						// fetch project
						//
						var project = new Project({
							project_uid: assessmentResults.get('project_uuid')
						});

						project.fetch({

							// callbacks
							//
							success: function() {

								// show assessment results view
								//
								Registry.application.show(
									new EditAssessmentResultsView({
										model: assessmentResults,
										project: project
									})
								);
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not fetch project."
									})
								);
							}
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch assessment results."
							})
						);
					}
				});
			});	
		}
	});
});


