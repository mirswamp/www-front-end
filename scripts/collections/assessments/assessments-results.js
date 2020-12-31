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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/assessments/assessment-results',
	'collections/base-collection'
], function($, _, Config, AssessmentResults, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: AssessmentResults,

		//
		// ajax methods
		//

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/projects/' + project.get('project_uid') + '/assessment_results'
			}));
		}
	});
});