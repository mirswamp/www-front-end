/******************************************************************************\
|                                                                              |
|                         package-version-file-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a file (usually shown within a         |
|        directory tree.                                                       |
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
	'text!templates/results/native-viewer/directory-tree/file.tpl',
	'models/assessments/assessment-results',
	'views/packages/info/versions/directory-tree/package-version-file-view',
	'utilities/web/query-strings'
], function($, _, Template, AssessmentResults, PackageVersionFileView) {
	return PackageVersionFileView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// querying methods
		//

		getBugCount: function() {
			var count = 0;
			for (var i = 0; i < this.options.bugInstances.length; i++) {
				var bugInstance = this.options.bugInstances[i];
				var primaryLocation = AssessmentResults.getPrimaryBugLocation(bugInstance.BugLocations);
				if (primaryLocation.SourceFile == 'pkg1/' + this.model.get('name')) {
					count++;
				}
			}
			return count;
		},

		getUrl: function() {
			return application.getURL() + 
				'#results/' + this.options.results.get('assessment_result_uuid') + 
				'/projects/' + this.options.projectUuid +
				'/source' + '?file=' + this.model.get('name') +
				(this.options.filter_type == 'include'? '&' + arrayToQueryString('include', this.options.filter) : '') +
				(this.options.filter_type == 'exclude'? '&' + arrayToQueryString('exclude', this.options.filter) : '');
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				selectable: this.isSelectable(),
				selected: this.options.selected,
				buildFile: this.isBuildFile(),
				bugCount: this.model.get('bug_count'),
				url: this.getUrl()
			};
		}
	});
});