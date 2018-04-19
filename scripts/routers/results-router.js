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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
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

		showProgress: function(options) {
			var self = this;
			require([
				'jquery',
				'underscore',
				'text!templates/viewers/progress.tpl',
				'registry',
			], function ($, _, Template, Registry) {
				Registry.application.showPage(new Backbone.Marionette.ItemView({
					template: _.template(Template, options)
				}));
			});
		},

		//
		// assessment results route handlers
		//

		showAssessmentResultsViewer: function(assessmentResultUuid, viewerUuid, projectUuid) {
			var self = this;
			require([
				'jquery',
				'underscore',
				'text!templates/viewers/progress.tpl',
				'registry',
				'models/assessments/assessment-results',
				'views/dialogs/notify-view'
			], function ($, _, Template, Registry, AssessmentResults, NotifyView) {

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
							self.gotResults = true;

							if (data.results_status === 'SUCCESS') {

								// display results in new window
								//
								self.showResultsData(data);
							} else if (data.results_status === 'LOADING') {

								// don't redraw if same status
								//
								if (data.results_viewer_status != lastStatus) {
									self.showProgress({
										title: 'Preparing Results',
										status: data.results_viewer_status
									});
									lastStatus = data.results_viewer_status;
								}

								// re-fetch without launching the viewer
								//
								setTimeout(function() {
									getInstanceStatus(data.viewer_instance);
								}, refreshInterval);
							} else if (data.results_status === 'FAILED') {

								// show error report
								//
								self.showJsonErrors(data.results);
							} else if (data.results_status === 'TRYAGAIN') {
			
								// display try again message
								//
								Registry.application.modal.show(
									new NotifyView({
										message: "Can not launch viewer at this time.  Please wait and try again soon."
									})
								);
							} else if (data.results_status == 'NOLAUNCH') {
								
								// display viewer error message
								//
								Registry.application.modal.show(
									new NotifyView({
										message: "Can not launch viewer.  Viewer has stopped. "
									})
								);	
							} else {

								// display results status error message
								//
								Registry.application.modal.show(
									new NotifyView({
										message: "Error viewing results: " + data.results_viewer_status
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
								runRequest.handleError(response, {

									// callbacks
									//
									success: function() {

										// start refreshing
										//
										getResults();
									},

									reject: function() {

										// update view
										//
										self.showProgress({
											title: 'Preparing Results',
											status: 'Results can not be shown until the tool policy is accepted.'
										});
									}
								});
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
								self.showResultsData(data);
							} else if(data.results_status === 'LOADING') {

								// redraw if status changes
								//
								if (data.results_viewer_status != lastStatus) {
									self.showProgress({
										title: 'Preparing Results',
										status: data.results_viewer_status
									});
									lastStatus = data.results_viewer_status;
								}

								// re-fetch without launching the viewer
								//
								setTimeout(function() {
									getInstanceStatus(data.viewer_instance)
								}, refreshInterval);
							} else if(data.results_status === 'CLOSED') {
									self.showProgress({
										title: 'Viewer Closed',
										status: data.results_viewer_status
									});
							} else {

								// display results status error message
								//
								Registry.application.modal.show(
									new NotifyView({
										message: "Error viewing results: " + data.results_viewer_status
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

				// show loading page if results take longer than 1 second to load
				//
				window.setTimeout(function() {
					if (!self.gotResults) {
						self.showProgress({
							title: 'Preparing Results',
							status: 'fetching results...'
						});
					}
				}, 1000);
				
				// start refreshing
				//
				getResults();
			});
		},

		showResultsData: function(data) {
			if (data.results) {
				if (typeof data.results == 'object') {
					this.showJsonResults(data.results);
				} else {
					this.showHtmlResults(data.results);
				}
			} else if (data.results_url) {

				// download results from url
				//
				window.location = data.results_url;
			}
		},

		showJsonResults: function(json) {
			require([
				'registry',
				'views/assessment-results/native-viewer/native-viewer-view'
			], function (Registry, NativeViewerView) {

				// show native viewer
				//
				Registry.application.showMain(
					new NativeViewerView({
						model: new Backbone.Model(json)
					})
				);
			});
		},

		showJsonErrors: function(json) {
			require([
				'registry',
				'views/assessment-results/error-report/error-report-view'
			], function (Registry, ErrorReportView) {

				// show error report
				//
				Registry.application.showMain(
					new ErrorReportView({
						model: new Backbone.Model(json)
					})
				);
			});
		},

		showHtmlResults: function(html) {
			require([
				'registry'
			], function (Registry) {

				// display results in formatted page view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'results', 

					// callbacks
					//
					done: function(view) {

						// insert results into DOM
						//
						view.$el.find('.content').append($(html));

						// add handler for anchor clicks
						//
						view.$el.find('.content').find('a').on('click', function(event) {
							var target = $(event.target).attr('href');
							if (target.startsWith('#')) {
								var element = view.$el.find('.content').find(target);
								event.preventDefault();
								var offset = element.position().top - 60;
								$(document.body).animate({
									'scrollTop': offset
								}, 500);
							}
						});

						// call window onload, if there is one
						//
						if (window.onload) {
							window.onload();
						}
					}
				});
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


