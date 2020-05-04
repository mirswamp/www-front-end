/******************************************************************************\
|                                                                              |
|                       package-version-directory-tree-view.js                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a directory tree.                      |
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
	'text!templates/results/native-viewer/directory-tree/directory-tree.tpl',
	'models/files/file',
	'models/files/directory',
	'models/assessments/assessment-results',
	'views/results/native-viewer/directory-tree/package-version-file-view',
	'views/packages/info/versions/directory-tree/package-version-directory-tree-view'
], function($, _, Template, File, Directory, AssessmentResults, PackageVersionFileView, PackageVersionDirectoryTreeView) {
	return PackageVersionDirectoryTreeView.extend({
		
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
				if (primaryLocation.SourceFile.startsWith('pkg1/' + this.model.get('name'))) {
					count++;
				}
			}
			return count;
		},

		//
		// ajax methods
		//

		fetchContents: function(options) {
			var self = this;
			var data = null;

			// set filtering params
			//
			if (this.options.filter) {
				switch (this.options.filter_type) {
					case 'include':
						data = {
							include: this.options.filter
						};
						break;
					case 'exclude':
						data = {
							exclude: this.options.filter
						};
						break;
				}
			}

			// fetch package version directory listing
			//
			this.options.packageVersion.fetchFileList({
				data: _.extend({
					dirname: this.model.get('name'),
					assessment_result_uuid: this.options.assessmentResultUuid,
				}, data),

				// callbacks
				//
				success: function(data) {

					// perform callback
					//
					if (options && options.success) {
						options.success(data);
					}
				},

				error: function() {

					// perform callback
					//
					if (options && options.error) {
						options.error(data);
					}
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				expanderClosedIcon: this.expanderClosedIcon,
				expanderOpenIcon: this.expanderOpenIcon,
				checked: this.model.has('contents'),
				selectable: this.isSelectable(),
				selected: this.isSelected(),
				root: (this.options.parent == undefined),
				bugCount: this.model.get('bug_count')
			};
		},

		getChildView: function(item) {
			if (item instanceof File) {
				return new PackageVersionFileView({
					model: item,
					selectable: this.options.selectable,
					selected: this.isFileSelected(item),
					bugInstances: this.options.bugInstances,
					results: this.options.results,
					projectUuid: this.options.projectUuid,
					filter_type: this.options.filter_type,
					filter: this.options.filter,
					parent: this
				});
			} else if (item instanceof Directory) {
				return new this.constructor({
					model: item,
					assessmentResultUuid: this.options.assessmentResultUuid,
					selectable: this.options.selectable,
					selectedDirectoryName: this.options.selectedDirectoryName,
					selectedFileName: this.options.selectedFileName,			
					packageVersion: this.options.packageVersion,
					bugInstances: this.options.bugInstances,
					results: this.options.results,
					projectUuid: this.options.projectUuid,
					expanded: this.options.expanded,
					filter_type: this.options.filter_type,
					filter: this.options.filter,
					parent: this
				});
			}
		}
	});
});