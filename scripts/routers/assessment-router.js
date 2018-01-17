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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {

	// create router
	//
	return Backbone.Router.extend({

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
				'registry',
				'routers/query-string-parser',
				'views/assessments/assessments-view'
			], function (Registry, QueryStringParser, AssessmentsView) {

				// show content view
				//
				Registry.application.showContent({
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
							view.content.show(
								new AssessmentsView({
									data: data,
									model: view.model
								})
							);
						});
					}
				});
			});
		},

		showDeleteAssessments: function(queryString) {
			var self = this;
			require([
				'registry',
				'routers/query-string-parser',
				'views/assessments/delete/delete-assessments-view'
			], function (Registry, QueryStringParser, DeleteAssessmentsView) {

				// show content view
				//
				Registry.application.showContent({
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
							view.content.show(
								new DeleteAssessmentsView({
									data: data,
									model: view.model
								})
							);
						});
					}
				});
			});
		},

		showRunAssessment: function(queryString) {
			var self = this;
			require([
				'registry',
				'routers/query-string-parser',
				'views/assessments/run/run-assessment-view'
			], function (Registry, QueryStringParser, RunAssessmentView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'assessments', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						QueryStringParser.fetch(QueryStringParser.parse(queryString, view.model), function(data) {
							
							// use trial project by default
							//
							if (!data['project']) {
								data['project'] = view.model;
							}

							// show run assessment view
							//
							view.content.show(
								new RunAssessmentView({
									data: data
								})
							);
						});
					}
				});
			});
		}
	});
});


