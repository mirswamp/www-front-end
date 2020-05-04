/******************************************************************************\
|                                                                              |
|                                assessment-router.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for assessment routes.       |
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
	'routers/base-router'
], function($, _, BaseRouter) {

	// create router
	//
	return BaseRouter.extend({

		//
		// route definitions
		//

		routes: {

			// project assessment routes
			//
			'assessments(?*query_string)': 'showAssessments',
			'assessments/delete(?*query_string)': 'showDeleteAssessments',
			'assessments/run(?*query_string)': 'showRunAssessment'
		},

		//
		// assessment route handlers
		//

		showAssessments: function(queryString) {
			var self = this;
			require([
				'routers/query-string-parser',
				'views/assessments/assessments-view'
			], function (QueryStringParser, AssessmentsView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'assessments', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {

							// show project assessments view
							//
							view.showChildView('content', new AssessmentsView({
								data: data,
								model: view.model
							}));
						});
					}
				});
			});
		},

		showDeleteAssessments: function(queryString) {
			var self = this;
			require([
				'routers/query-string-parser',
				'views/assessments/delete/delete-assessments-view'
			], function (QueryStringParser, DeleteAssessmentsView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'assessments', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {

							// show delete assessments view
							//
							view.showChildView('content', new DeleteAssessmentsView({
								data: data,
								model: view.model
							}));
						});
					}
				});
			});
		},

		showRunAssessment: function(queryString) {
			var self = this;
			require([
				'routers/query-string-parser',
				'views/assessments/run/run-assessment-view'
			], function (QueryStringParser, RunAssessmentView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'assessments', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {

							// show run assessment view
							//
							view.showChildView('content', new RunAssessmentView({
								data: data,
								project: view.model
							}));
						});
					}
				});
			});
		}
	});
});