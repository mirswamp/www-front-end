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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'routers/base-router',
	'views/dialogs/dialog-view',
	'utilities/web/query-strings'
], function($, _, BaseRouter, DialogView) {

	//
	// local variables
	//

	var refreshInterval = 3000;

	// create router
	//
	return BaseRouter.extend({

		//
		// route definitions
		//

		routes: {

			// result administration routes
			//
			'results/review(?*query_string)': 'showReviewResults',

			// assessment results routes
			//
			'results/:assessment_results_uid/viewer/:viewer_uuid/project/:project_uuid(?*query_string)': 'showAssessmentResultsViewer',
			'results/:assessment_results_uid/projects/:project_uuid/source(?*query_string)': 'showAssessmentResultsSource',
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
				'routers/query-string-parser',
				'collections/viewers/viewers',
				'views/results/assessment-runs/review/review-results-view'
			], function (QueryStringParser, Viewers, ReviewResultsView) {

				// fetch viewers
				//
				new Viewers().fetchAll({

					// callbacks
					//
					success: function(collection) {

						// show content view
						//
						application.showContent({
							'nav1': 'home',
							'nav2': 'overview', 

							// callbacks
							//
							done: function(view) {
								QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {

									// show review results view
									//
									view.showChildView('content', new ReviewResultsView({
										data: data,
										viewers: collection
									}));
								});
							}
						});
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch project viewers."
						});
					}
				});	
			});
		},

		showProgress: function(options) {

			// skip if dialogs are shown
			//
			if (DialogView.dialogs.length != 0 && !(options && options.force)) {
				return;
			}

			var self = this;
			require([
				'jquery',
				'underscore',
				'text!templates/viewers/progress.tpl',
				'views/base-view'
			], function ($, _, Template, BaseView) {
				application.showPage(new BaseView({
					template: _.template(_.template(Template)(options))
				}));
			});
		},

		//
		// ajax methods
		//

		fetchAndShowWarnings: function(assessmentResultUuid, viewerUuid, projectUuid, options) {
			var self = this;
			this.fetchAssessmentResultsData(assessmentResultUuid, viewerUuid, projectUuid, {
				type: 'warnings',

				// callbacks
				//
				success: function(results, data) {
					self.showJsonWarnings(data.results);
				},

				error: function(results, data) {

					// show error dialog
					//
					application.error({
						message: 'Could not fetch warnings.'
					});
				}
			});
		},

		fetchAndShowErrors: function(assessmentResultUuid, viewerUuid, projectUuid, options) {
			var self = this;
			this.fetchAssessmentResultsData(assessmentResultUuid, viewerUuid, projectUuid, {
				type: 'errors',

				// callbacks
				//
				success: function(results, data) {
					self.showJsonErrors(data.results);
				},

				error: function(results, data) {

					// show error dialog
					//
					application.error({
						message: 'Could not fetch errors.'
					});
				}
			});
		},

		fetchAndShowResults: function(assessmentResultUuid, viewerUuid, projectUuid, options) {
			var self = this;
			this.fetchAssessmentResultsData(assessmentResultUuid, viewerUuid, projectUuid, _.extend({}, options, {

				// callbacks
				//
				success: function(results, data) {
					self.showResultsData(assessmentResultUuid, results, data, viewerUuid, projectUuid, options);
				},

				error: function(results, data) {

					// show error dialog
					//
					application.error({
						message: 'Could not fetch assessment results.'
					});
				}
			}));
		},

		//
		// assessment results route handlers
		//

		showAssessmentResultsViewer: function(assessmentResultUuid, viewerUuid, projectUuid) {
			var options = queryStringToData(getQueryString());

			// strip query string
			//
			if (projectUuid.contains('?')) {
				var pair = projectUuid.split("?");
				projectUuid = pair[0];
				options = queryStringToData(pair[1]);
			}

			switch (options.type) {

				// fetch warnings
				//
				case 'warnings':
					this.fetchAndShowWarnings(assessmentResultUuid, viewerUuid, projectUuid);
					break;

				// fetch errors
				//
				case 'errors':
					this.fetchAndShowErrors(assessmentResultUuid, viewerUuid, projectUuid);
					break;

				// fetch results
				//
				default:
					this.fetchAndShowResults(assessmentResultUuid, viewerUuid, projectUuid, options);
					break;
			}
		},

		showResultsData: function(assessmentResultUuid, results, data, viewerUuid, projectUuid, options) {
			if (data.results) {
				if (typeof data.results == 'object') {
					this.showJsonResults(assessmentResultUuid, results, data.results, viewerUuid, projectUuid, options);
				} else {
					this.showHtmlResults(results, data.results, projectUuid);
				}
			} else if (data.results_url) {

				// download results from url
				//
				window.location = data.results_url;
			}
		},

		showJsonResults: function(assessmentResultUuid, results, json, viewerUuid, projectUuid) {
			require([
				'views/results/native-viewer/native-viewer-view'
			], function (NativeViewerView) {

				// show native viewer
				//
				application.showMain(new NativeViewerView({
					model: new Backbone.Model(json),
					assessmentResultUuid: assessmentResultUuid,
					results: results,
					viewerUuid: viewerUuid,
					projectUuid: projectUuid
				}), {
					nav2: 'results'
				});
			});
		},

		showJsonWarnings: function(json) {
			require([
				'views/results/warning-report/warning-report-view'
			], function (WarningReportView) {

				// show error report
				//
				application.showMain(new WarningReportView({
					model: new Backbone.Model(json)
				}), {
					nav2: 'results'
				});
			});
		},

		showJsonErrors: function(json) {
			require([
				'views/results/error-report/error-report-view'
			], function (ErrorReportView) {

				// show error report
				//
				application.showMain(new ErrorReportView({
					model: new Backbone.Model(json)
				}), {
					nav2: 'results'
				});
			});
		},

		showHtmlResults: function(html) {

			// display results in formatted page view
			//
			application.showContent({
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
		},

		showAssessmentResultsSource: function(assessmentResultUuid, projectUuid, queryString) {
			var self = this;
			var params = queryStringToData(queryString);
			require([
				'models/assessments/assessment-results',
				'utilities/web/query-strings'
			], function (AssessmentResults) {

				// show results and source code
				//
				self.fetchNativeResultsData(assessmentResultUuid, projectUuid, {

					// options
					//
					file: params.file? params.file : null,
					include: params.include? params.include : null,
					exclude: params.exclude? params.exclude : null,

					// callbacks
					//
					success: function(results, data, options) {
						var bugIndex = parseInt(params.bugindex) || 0;
						var viewerUuid = options.viewer? options.viewer.get('viewer_uuid') : null;

						// find source code file to display
						//
						var bugInstances = data.results.AnalyzerReport.BugInstances;
						var bugInstance = bugInstances && bugIndex != undefined? bugInstances[bugIndex] : undefined;
						var bugLocation = bugInstance? AssessmentResults.getPrimaryBugLocation(bugInstance.BugLocations) : undefined;
						var filename = params.file? params.file : bugLocation.SourceFile;

						// strip artificial dereference from file path
						//
						if (filename.startsWith('pkg1/')) {
							filename = filename.replace('pkg1/', '');
						}

						self.showSourceCode(filename, data, {
							results: results, 
							projectUuid: projectUuid,
							viewerUuid: viewerUuid,
							bugIndex: params.bugindex != undefined? bugIndex : undefined,
							bugInstance: params.bugindex != undefined? bugInstance : undefined,
							bugLocation: params.bugindex != undefined? bugLocation : undefined,
							bugInstances: bugInstances
						});
					}
				});
			});
		},

		showAssessmentsResults: function(queryString) {
			var self = this;
			require([
				'routers/query-string-parser',
				'collections/viewers/viewers',
				'views/results/assessments-results-view'
			], function (QueryStringParser, Viewers, AssessmentsResultsView) {

				// show content view
				//
				application.showContent({
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
							new Viewers().fetchAll({

								// callbacks
								//
								success: function(collection) {

									// show assessments results view
									//
									view.showChildView('content', new AssessmentsResultsView({
										data: data,
										model: view.model,
										viewers: collection
									}));
								},

								error: function() {

									// show error message
									//
									application.error({
										message: "Could not fetch project viewers."
									});
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
				'routers/query-string-parser',
				'views/results/delete/delete-assessments-results-view'
			], function (QueryStringParser, DeleteAssessmentsResultsView) {

				// show content view
				//
				application.showContent({
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
							view.showChildView('content', new DeleteAssessmentsResultsView({
								data: data,
								model: view.model,
							}));
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
				'models/projects/project',
				'models/assessments/execution-record',
				'views/results/assessment-runs/status/assessment-run-status-view',
			], function (Project, ExecutionRecord, AssessmentRunStatusView) {

				// show content view
				//
				application.showContent({
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
										view.showChildView('content', new AssessmentRunStatusView({
											model: executionRecord,
											project: project,
											queryString: queryString
										}));
									},

									error: function() {

										// show error message
										//
										application.error({
											message: "Could not fetch execution record's project."
										});
									}
								});
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not fetch execution record."
								});
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
				'models/projects/project',
				'models/assessments/assessment-results',
				'views/results/assessment-results-view',
			], function (Project, AssessmentResults, AssessmentResultsView) {

				// fetch assessment results
				//
				new AssessmentResults({
					assessment_result_uuid: assessmentResultUuid
				}).fetch({

					// callbacks
					//
					success: function(model) {

						// fetch project
						//
						new Project({
							project_uid: model.get('project_uuid')
						}).fetch({

							// callbacks
							//
							success: function(project) {

								// show assessment results view
								//
								application.showPage(new AssessmentResultsView({
									model: model,
									project: project
								}));
							},

							error: function() {

								// show error message
								//
								application.showPage(new ErrorDialogView({
									message: "Could not fetch project."
								}));
							}
						});
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch assessment results."
						});
					}
				});
			});
		},

		showEditAssessmentResults: function(assessmentResultUuid) {
			require([
				'models/projects/project',
				'models/assessments/assessment-results',
				'views/results/edit/edit-assessments-results-view',
			], function (Project, AssessmentResults, EditAssessmentResultsView) {

				// fetch assessment results
				//
				new AssessmentResults({
					assessment_result_uuid: assessmentResultUuid
				}).fetch({

					// callbacks
					//
					success: function(model) {

						// fetch project
						//
						new Project({
							project_uid: model.get('project_uuid')
						}).fetch({

							// callbacks
							//
							success: function(project) {

								// show assessment results view
								//
								application.show(new EditAssessmentResultsView({
									model: model,
									project: project
								}));
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not fetch project."
								});
							}
						});
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch assessment results."
						});
					}
				});
			});	
		},

		showSourceCode: function(filename, data, options) {
			require([
				'models/packages/package-version',
				'models/assessments/assessment-results',
				'views/results/native-viewer/source-code-view',
				'views/error-page-view'
			], function (PackageVersion, AssessmentResults, SourceCodeView, ErrorPageView) {
				var packageVersion = new PackageVersion({
					package_version_uuid: data.results.package.package_version_uuid
				});

				// fetch source code
				//
				packageVersion.fetchFile(filename, {

					// callbacks
					//
					success: function(source) {
						if (source) {

							// show source code and results
							//
							application.showMain(new SourceCodeView({
								filename: filename,
								source: source,
								data: data,
								projectUuid: options.projectUuid,
								viewerUuid: options.viewerUuid,
								bugIndex: options.bugIndex,
								bugInstance: options.bugInstance,
								bugLocation: options.bugLocation,
								bugInstances: AssessmentResults.getBugInstancesByFile(options.bugInstances, 'pkg1/' + filename)
							}),{
								nav2: 'results',
								full: true
							});
						} else {
							application.showMain(new ErrorPageView({
								title: "404 - File not found",
								message: "The file '" + filename + "'' was not found in the original source code."
							}));
						}
					},

					error: function() {

						// show notify message
						//
						application.showMain(new ErrorPageView({
							title: "404 - File not found",
							message: "The file '" + filename + "'' was not found in the original source code."
						}));
					}
				});
			});
		},

		//
		// ajax methods
		//

		fetchNativeResultsData: function(assessmentResultUuid, projectUuid, options) {
			var self = this;
			require([
				'collections/viewers/viewers',
			], function (Viewers) {

				// fetch viewers
				//
				new Viewers().fetchAll({

					// callbacks
					//
					success: function(collection) {
						var viewer = collection.where({
							name: 'Native'
						})[0];

						if (viewer) {
							self.fetchAssessmentResultsData(assessmentResultUuid, viewer.get('viewer_uuid'), projectUuid, _.extend(options, {
								viewer: viewer,
								file: options.file,
								include: options.include,
								exclude: options.exclude
							}));
						} else {

							// show error message
							//
							application.error({
								message: "Could not find native viewer."
							});
						}
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch project viewers."
						});
					}
				});
			});
		},

		getInstanceStatus: function(results, viewerInstanceUuid, options) {
			var self = this;
			results.fetchInstanceStatus(viewerInstanceUuid, {
				timeout: 0,

				// callbacks
				//
				success: function(data) {
					switch (data.results_status) {
						case 'SUCCESS':

							// found results
							//
							options.success(results, data);
							break;

						case 'LOADING':

							// redraw if status changes
							//
							if (data.results_viewer_status != self.lastStatus) {
								self.showProgress({
									title: 'Preparing Results',
									status: data.results_viewer_status
								});
								self.lastStatus = data.results_viewer_status;
							}

							// re-fetch without launching the viewer
							//
							self.timeout = setTimeout(function() {
								self.getInstanceStatus(results, data.viewer_instance, options);
							}, refreshInterval);
							break;

						case 'CLOSED':

							// report viewer closed
							//
							self.showProgress({
								title: 'Viewer Closed',
								status: data.results_viewer_status
							});
							break;

						case 'TIMEOUT':

							// report viewer launch timeout
							//
							self.showProgress({
								title: 'Viewer Launch Timeout',
								status: data.results_viewer_status
							});
							break;

						default:

							// display results status error message
							//
							self.showProgress({
								title: 'Error Viewing Results',
								status: data.results_viewer_status
							});
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch assessment results content."
					});
				}
			});
		},

		fetchAssessmentResultsData: function(assessmentResultUuid, viewerUuid, projectUuid, options) {
			var self = this;
			require([
				'jquery',
				'underscore',
				'models/assessments/assessment-results',
			], function ($, _, AssessmentResults) {

				// get assessment results
				//
				var results = new AssessmentResults({
					assessment_result_uuid: assessmentResultUuid
				});
				self.lastStatus = '';

				// call stored procedure
				//
				var getResults = function() {
					var data = {};

					// add filter parameters
					//
					if (options.include) {
						data.include = options.include;
					} else if (options.exclude) {
						data.exclude = options.exclude;
					}

					// add optional parameters
					//
					if (options.from) {
						data.from = options.from;
					}
					if (options.to) {
						data.to = options.to;
					}
					if (options.file) {
						data.file = options.file;
					}
					if (options.type) {
						data.type = options.type;
					}

					results.fetchResults(viewerUuid, projectUuid, {
						timeout: 0,
						data: data,

						// callbacks
						//
						success: function(data) {
							self.gotResults = true;
							switch (data.results_status) {

								case 'SUCCESS':

									// found results
									//
									options.success(results, data, options);
									break;

								case 'LOADING':

									// don't redraw if same status
									//
									if (data.results_viewer_status != self.lastStatus) {
										self.showProgress({
											title: 'Preparing Results',
											status: data.results_viewer_status
										});
										self.lastStatus = data.results_viewer_status;
									}

									// re-fetch without launching the viewer
									//
									self.timeout = setTimeout(function() {
										self.getInstanceStatus(results, data.viewer_instance, options);
									}, refreshInterval);
									break;

								case 'FAILED':

									// could not find results
									//
									if (options.type == 'errors' || options.type == 'warnings') {
										options.success(results, data);
									} else {
										options.error(results, data);
									}
									break;

								case 'TRYAGAIN':

									// display try again message
									//
									application.notify({
										message: "Can not launch viewer at this time.  Please wait and try again soon."
									});
									break;

								case 'NOLAUNCH':

									// display viewer error message
									//
									application.notify({
										message: "Can not launch viewer.  Viewer has stopped. "
									});
									break;

								default:

									// display results status error message
									//
									self.showProgress({
										title: 'Error Viewing Results',
										status: data.results_viewer_status
									});
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
											status: 'Results can not be shown until the tool policy is accepted.',
											force: true
										});
									}
								});
							});
						}
					});
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
		}
	});
});