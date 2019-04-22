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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/results/native-viewer/directory-tree/file.tpl',
	'registry',
	'models/assessments/assessment-results',
	'views/packages/info/versions/directory-tree/package-version-file-view',
	'utilities/browser/query-strings'
], function($, _, Template, Registry, AssessmentResults, PackageVersionFileView) {
	return PackageVersionFileView.extend({

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
			return Registry.application.getURL() + 
				'#results/' + this.options.results.get('assessment_result_uuid') + 
				'/projects/' + this.options.projectUuid +
				'/source' + '?file=' + this.model.get('name') +
				(this.options.filter_type == 'include'? '&' + arrayToQueryString('include', this.options.filter) : '') +
				(this.options.filter_type == 'exclude'? '&' + arrayToQueryString('exclude', this.options.filter) : '');
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				selectable: this.isSelectable(),
				selected: this.options.selected,
				buildFile: this.isBuildFile(),
				//bugCount: this.getBugCount(),
				bugCount: data['bug_count'],
				url: this.getUrl()
			}));
		}
	});
});