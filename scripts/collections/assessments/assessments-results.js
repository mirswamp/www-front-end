/******************************************************************************\
|                                                                              |
|                              assessments-results.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of assessment runs.                    |
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
	'config',
	'models/assessments/assessment-results'
], function($, _, Backbone, Config, AssessmentResults) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: AssessmentResults,

		//
		// ajax methods
		//

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.csa + '/projects/' + project.get('project_uid') + '/assessment_results'
			}));
		}
	});
});