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
	'text!templates/packages/info/versions/directory-tree/package-version-file.tpl',
	'views/files/directory-tree/file-view',
	'utilities/scripting/file-utils'
], function($, _, Template, FileView, FileUtils) {

	//
	// static attributes
	//
	
	var buildFiles = [
		'composer.json',
		'configure.ac',
		'makefile',
		'Makefile',
		'package.json',
		'pom.xml',
		'build.xml',
		'build.gradle',
		'gradlew',
		'AndroidManifest.xml',
		'setup.py',
		'configure',
		'rakefile',
		'Rakefile',
		'Gemfile'
	];

	var buildFileExtensions = [
		'sln',
		'csproj'
	];

	return FileView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// querying methods
		//

		isBuildFile: function() {
			var name = this.model.get('name');
			var filename = name.replace(/^.*[\\\/]/, '');
			
			// check to see if filename is in list of build files
			//
			for (var i = 0; i < buildFiles.length; i++) {
				if (filename == buildFiles[i]) {
					return true;
				}
			}

			// check to see if file's extension is in list of build file extensions
			//
			var extension = getFileExtension(filename);
			if (buildFileExtensions.contains(extension)) {
				return true;
			}

			return false;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				selectable: this.isSelectable(),
				selected: this.options.selected,
				buildFile: this.isBuildFile()
			};
		}
	});
});