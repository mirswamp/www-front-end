/******************************************************************************\
|                                                                              |
|                                 package-version.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a version of a software package.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'registry',
	'models/utilities/shared-version',
	'views/dialogs/error-view'
], function($, _, Config, Registry, SharedVersion, ErrorView) {
	var Class = SharedVersion.extend({

		//
		// attributes
		//

		allowedExtensions: [
			'.zip',
			'.tar',
			'.tar.gz',
			'.tgz',
			'.tar.bz2',
			'.tar.xz',
			'.tar.Z',
			'.jar',
			'.war',
			'.ear',
			'.gem',
			'.whl',
			'.apk'
		],

		//
		// Backbone attributes
		//

		idAttribute: 'package_version_uuid',
		urlRoot: Config.servers.web + '/packages/versions',

		//
		// methods
		//

		initialize: function(attributes) {
			this.set({

				// attributes
				//
				'package_uuid': attributes['package_uuid'],
				'platform_uuid': attributes['platform_uuid'],

				// version attributes
				//
				'version_string': attributes['version_string'],
				'language_version': attributes['language_version'],
				'version_sharing_status': attributes['version_sharing_status'],
				
				// date / detail attributes
				//
				'release_date': attributes['release_date'],
				'retire_date': attributes['retire_date'],
				'notes': attributes['notes'],

				// path attributes
				//
				'source_path': attributes['source_path'],
				'filename': attributes['filename'],

				// config attributes
				//
				'config_dir': attributes['config_dir'],
				'config_cmd': attributes['config_cmd'],
				'config_opt': attributes['config_opt'],

				// build attributes
				//
				'build_file': attributes['build_file'],
				'build_system': attributes['build_system'],
				'build_target': attributes['build_target'],

				// advanced build attributes
				//
				'build_dir': attributes['build_dir'],
				'build_cmd': attributes['build_cmd'],
				'build_opt': attributes['build_opt'],

				// java source code attributes
				//
				'use_gradle_wrapper': attributes['use_gradle_wrapper'],
				'maven_version': attributes['maven_version'],

				// java bytecode attributes
				//
				'bytecode_class_path': attributes['bytecode_class_path'],
				'bytecode_aux_class_path': attributes['bytecode_aux_class_path'],
				'bytecode_source_path': attributes['bytecode_source_path'],

				// android attributes
				//
				'android_sdk_target': attributes['android_sdk_target'],
				'android_lint_target': attributes['android_lint_target'],
				'android_redo_build': attributes['android_redo_build'],
				'android_maven_plugin': attributes['android_maven_plugin']
			});
		},

		//
		// query methods
		//

		getFilename: function() {
			if (this.has('filename')) {

				// package version has been uploaded
				//
				return this.get('filename');
			} else if (this.has('package_path')) {

				// package version has not yet been uploaded
				//
				return this.getFilenameFromPath(this.get('package_path'));
			}
		},
		
		getFilenameFromPath: function(filePath) {
			if (filePath) {

				// split file path by slashes
				//
				if (filePath.indexOf('/') != -1) {

					// file path uses forward slashes
					//
					var substrings = filePath.split('/');
				} else {

					// file path uses back slashes
					//
					var substrings = filePath.split('\\');
				}

				// return last portion of string
				//
				return substrings[substrings.length - 1];
			}
		},

		isAllowedFilename: function(fileName) {

			// check allowed extensions
			//
			if (fileName) {
				for (var i = 0; i < this.allowedExtensions.length; i++) {
					if (fileName.endsWith(this.allowedExtensions[i])) {
						return true;
					}
				}
			}

			return false;
		},

		isBuildNeeded: function() {
			return (this.has('build_system') &&
				this.get('build_system') != 'no-build' &&
				this.get('build_system') != 'none') &&
				this.get('build_system') != 'ruby-gem' &&
				this.get('build_system') != 'android-apk';
		},

		isAtomic: function() {
			filename = this.getFilename();

			// this specifies whether a package's versions can specify 
			// a package path within the top level directory.
			//
			var isWheel = filename.endsWith('.whl');
			var isApk = filename.endsWith('.apk');
			return isWheel || isApk;
		},

		//
		// ajax methods
		//

		upload: function(data, options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/upload',
				type: 'POST',
				xhr: function() {

					// custom XMLHttpRequest
					//
					var myXhr = $.ajaxSettings.xhr();
					if(myXhr.upload) {
						if(options.onprogress) {
							myXhr.upload.addEventListener('progress', options.onprogress, false);
						}
					}
					return myXhr;
				},

				// data to upload
				//
				data: data,

				// options to tell jQuery not to process data or worry about content-type.
				//
				cache: false,
				contentType: false,
				processData: false,

				// callbacks
				//
				// beforeSend: this.onUploadStart,
			}));
		},

		download: function() {
			window.location = this.urlRoot + '/' + this.get('package_version_uuid') + '/download';
		},

		add: function(options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + this.get('package_version_uuid') + '/add',
				type: 'POST'
			}));	
		},

		store: function(options) {
			this.save(this.attributes, _.extend(options, {
				url: this.urlRoot + '/store',
				type: 'POST'
			}));	
		},

		//
		// sharing ajax methods
		//

		fetchSharedProjects: function(options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + this.get('package_version_uuid') + '/sharing',
				type: 'GET'
			}));
		},

		saveSharedProjects: function(projects, options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + this.get('package_version_uuid') + '/sharing',
				type: 'PUT',
				dataType: 'JSON',
				data: {
					//'projects': projects.toJSON()
					'project_uuids': projects.getUuids()
				}
			}));
		},

		//
		// archive inspection methods
		//

		fetchRoot: function(options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/root',
				type: 'GET',
				data: {
					package_path: this.isNew()? this.get('package_path') : undefined,
					source_path: this.isNew()? this.get('source_path') : undefined
				}
			}));
		},

		fetchContents: function(filename, dirname, options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/contains',
				type: 'GET',
				data: {
					filename: filename,
					dirname: dirname, 
					recursive: options.recursive,
					package_path: this.isNew()? this.get('package_path') : undefined,
					source_path: this.isNew()? this.get('source_path') : undefined
				}
			}));
		},

		fetchFileTypes: function(options) {
			if (this.isNew()) {
				if (!options.data) {
					options.data = {};
				}
				options.data['package_path'] = this.get('package_path')
			}
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/file-types',
				type: 'GET'
			}));
		},

		fetchFileList: function(options) {
			if (this.isNew()) {
				if (!options.data) {
					options.data = {};
				}
				options.data['package_path'] = this.get('package_path')
			}
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/file-list',
				type: 'GET'
			}));
		},

		fetchFileTree: function(options) {
			if (this.isNew()) {
				if (!options.data) {
					options.data = {};
				}
				options.data['package_path'] = this.get('package_path')
			}
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/file-tree',
				type: 'GET'
			}));
		},

		fetchDirectoryList: function(options) {
			if (this.isNew()) {
				if (!options.data) {
					options.data = {};
				}
				options.data['package_path'] = this.get('package_path')
			}
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/directory-list',
				type: 'GET'
			}));
		},

		fetchDirectoryTree: function(options) {
			if (this.isNew()) {
				if (!options.data) {
					options.data = {};
				}
				options.data['package_path'] = this.get('package_path')
			}
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/directory-tree',
				type: 'GET'
			}));
		},

		//
		// specialized package inspection methods
		//

		fetchBuildSystem: function(options) {
			if (this.isNew()) {
				if (!options.data) {
					options.data = {};
				}
				options.data['package_path'] = this.get('package_path');
				options.data['source_path'] = this.get('source_path');
			}
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/build-system',
				type: 'GET'
			}));
		},

		fetchRubyGemInfo: function(options) {
			if (this.isNew()) {
				if (!options.data) {
					options.data = {};
				}
				options.data['package_path'] = this.get('package_path')
			}
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/ruby-gem-info',
				type: 'GET'
			}));		
		},

		fetchPythonWheelInfo: function(options) {
			if (this.isNew()) {
				if (!options.data) {
					options.data = {};
				}
				options.data['package_path'] = this.get('package_path')
			}
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + (this.isNew()? 'new': this.get('package_version_uuid')) + '/python-wheel-info',
				type: 'GET'
			}));		
		},

		fetchRubyVersion: function() {

			// fetch type of ruby gem
			//
			this.fetchRubyGemInfo(_.extend(options, {

				// callbacks
				//
				success: function(data) {
					success([Class.gemInfoToRubyVersion(data)]);
				},

				error: function(jqXHR, textStatus, errorThrown) {
					error(jqXHR, textStatus, errorThrown);
				}
			}));
		},

		//
		// package inspection methods
		//

		getNumCFiles: function(data) {
			var count = 0;

			// add counts for c file types
			//
			if (data['c']) {
				count += data['c'];
			}
			if (data['cpp']) {
				count += data['cpp'];
			}

			return count;
		},

		getNumJavaSourceFiles: function(data) {
			var count = 0;

			// add counts for c file types
			//
			if (data['java']) {
				count += data['java'];
			}

			return count;
		},

		getNumJavaBytecodeFiles: function(data) {
			var count = 0;

			// add counts for c file types
			//
			if (data['class']) {
				count += data['class'];
			}
			if (data['jar']) {
				count += data['jar'];
			}

			return count;
		},

		getNumPythonFiles: function(data) {
			var count = 0;

			// add counts for python file types
			//
			if (data['py']) {
				count += data['py'];
			}

			return count;
		},

		getNumRubyFiles: function(data) {
			var count = 0;

			// add counts for ruby file types
			//
			if (data['rb']) {
				count += data['rb'];
			}

			return count;
		},

		getNumHTMLFiles: function(data) {
			var count = 0;

			// add counts for html file types
			//
			if (data['htm']) {
				count += data['htm'];
			}
			if (data['html']) {
				count += data['html'];
			}
			if (data['tpl']) {
				count += data['tpl'];
			}

			return count;
		},

		getNumJavascriptFiles: function(data) {
			var count = 0;

			// add counts for javascript file types
			//
			if (data['js']) {
				count += data['js'];
			}

			return count;
		},

		getNumCSSFiles: function(data) {
			var count = 0;

			// add counts for CSS file types
			//
			if (data['css']) {
				count += data['css'];
			}

			return count;
		},

		getNumPHPFiles: function(data) {
			var count = 0;

			// add counts for PHP file types
			//
			if (data['php']) {
				count += data['php'];
			}

			return count;
		},

		getNumXMLFiles: function(data) {
			var count = 0;

			// add counts for PHP file types
			//
			if (data['xml']) {
				count += data['xml'];
			}

			return count;
		},

		getNumWebScriptingFiles: function(data) {
			var count = 0;

			// add counts for web scripting file types
			//
			count += this.getNumHTMLFiles(data);
			count += this.getNumJavascriptFiles(data);
			count += this.getNumCSSFiles(data);
			count += this.getNumPHPFiles(data);
			count += this.getNumXMLFiles(data);

			return count;
		},

		fileTypesToPackageFileCounts: function(data) {

			// find file counts for each package type
			//
			var packageFileCounts = [{
					packageType: 'c-source',
					numFiles: this.getNumCFiles(data)
				}, {
					packageType: 'java-source',
					numFiles: this.getNumJavaSourceFiles(data)
				}, {
					packageType: 'java-bytecode',
					numFiles: this.getNumJavaBytecodeFiles(data)
				}, {
					packageType: 'python',
					numFiles: this.getNumPythonFiles(data)
				}, {
					packageType: 'ruby',
					numFiles: this.getNumRubyFiles(data)
				}, {
					packageType: 'web-scripting',
					numFiles: this.getNumWebScriptingFiles(data)
				}
			];

			// sort by count field
			//
			packageFileCounts.sort(function(a, b) {
				return ((a.numFiles < b.numFiles) ? 1 : ((a.numFiles > b.numFiles) ? -1 : 0));
			});

			return packageFileCounts;
		},

		packageFileCountsToPackageTypes: function(packageFileCounts) {

			// extract valid package types from counts
			//
			var packageTypes = [];
			for (var i = 0; i < packageFileCounts.length; i++) {
				if (packageFileCounts[i].numFiles > 0) {
					packageTypes.push(packageFileCounts[i].packageType);
				}
			}

			return packageTypes;
		},

		packageFileCountsToLanguageVersions: function(packageFileCounts) {

			// extract language versions from counts
			//
			var languageVersions = [];
			for (var i = 0; i < packageFileCounts.length; i++) {
				if (packageFileCounts[i].numFiles > 0) {
					languageVersions.push(undefined);
				}
			}

			return languageVersions;
		},

		inferPackageTypes: function(options) {
			var self = this;

			// check for gemfiles
			//
			if (this.getFilename().endsWith('.gem')) {
				var success = options.success;
				var error = options.error;

				// fetch ruby gem info
				//
				this.fetchRubyGemInfo(_.extend(options, {

					// callbacks
					//
					success: function(data) {
						success([Class.gemInfoToPackageType(data)], 
							[Class.gemInfoToRubyVersion(data)]);
					},

					error: function(jqXHR, textStatus, errorThrown) {
						success(['ruby']);
					}
				}));

				return;
			}

			// check for wheel files
			//
			if (this.getFilename().endsWith('.whl')) {
				var success = options.success;
				var error = options.error;

				// get director name to look for wheel files
				//
				var dirname = this.getWheelDirname();
				if (options.data.dirname) {

					// strip off trailing slash
					//
					if (options.data.dirname.endsWith('/')) {
						options.data.dirname = options.data.dirname.substring(0, options.data.dirname.length - 1);
					}
					
					dirname = options.data.dirname + '/' + dirname;
				}

				// fetch python wheel info
				//
				this.fetchPythonWheelInfo(_.extend(options, {

					data: {
						'dirname': dirname
					},

					// callbacks
					//
					success: function(data) {
						success([Class.wheelInfoToPackageType(data)]);
					},

					error: function(jqXHR, textStatus, errorThrown) {
						success(['python']);
					}
				}));
				
				return;
			}

			// check for gemfiles
			//
			if (this.getFilename().endsWith('.apk')) {
				options.success(['android-bytecode']);
				return;
			}

			// fetch file types
			//
			if (this.isNew()) {
				options.data['package_path'] = this.get('package_path')
			}
			var success = options.success;
			var error = options.error;
			this.fetchFileTypes(_.extend(options, {

				// callbacks
				//
				success: function(data) {
					var packageFileCounts = self.fileTypesToPackageFileCounts(data);
					var packageTypes = self.packageFileCountsToPackageTypes(packageFileCounts);
					var languageVersions = self.packageFileCountsToLanguageVersions(packageFileCounts);
					var fileTypes = Object.keys(data);

					if (_.contains(packageTypes, 'ruby')) {

						// check ruby package type
						//
						self.fetchRubyGemInfo(_.extend(options, {

							// callbacks
							//
							success: function(data) {
								var rubyPackageType = Class.gemInfoToPackageType(data);
								var languageVersion = Class.gemInfoToRubyVersion(data);

								// replace ruby with specific gem type
								//
								for (var i = 0; i < packageTypes.length; i++) {
									if (packageTypes[i] == 'ruby') {
										packageTypes[i] = rubyPackageType;
										languageVersions[i] = languageVersion;
									}
								}

								// return package, language version, and file types
								//
								success(packageTypes, languageVersions, fileTypes);
							},

							error: function(jqXHR, textStatus, errorThrown) {

								// return package and file types
								//
								success(packageTypes, [], fileTypes);
							}
						}));
					} else {

						// return package and file types
						//
						success(packageTypes, [], fileTypes);		
					}
				},

				error: function(jqXHR, textStatus, errorThrown) {
					error(jqXHR, textStatus, errorThrown);
				}
			}));
		},

		//
		// build system methods
		//

		checkBuildSystem: function(options) {
			if (this.has('build_system') && this.get('build_system') != 'no-build') {
				
				// check package version build system
				//
				$.ajax(_.extend(options, {
					url: this.urlRoot + '/build-system/check',
					type: 'POST',
					data: this.toJSON()
				}));
			} else {

				// if no build system, then return success
				//
				if (options && options.success) {
					options.success();
				}
			}
		},

		//
		// python package version querying methods
		//

		getWheelPackageName: function() {
			var filename = this.getFilename();
			if (filename) {
				var words = filename.split('-');
				return words[0];
			} 
		},

		getWheelPackageVersion: function() {
			var filename = this.getFilename();
			if (filename) {
				var words = filename.split('-');
				return words[1];
			} 	
		},

		getWheelDirname: function() {
			return this.getWheelPackageName() + '-' + this.getWheelPackageVersion() + '.dist-info/';
		},

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			var response = SharedVersion.prototype.parse.call(this, response);

			// convert dates
			//
			if (response.release_date) {
				response.release_date = this.toDate(response.release_date);
			}
			if (response.retire_date) {
				response.retire_date = this.toDate(response.retire_date);
			}

			return response;
		}
	}, {

		//
		// static methods
		//

		gemToPackageType: function(gem) {
			for (var i = 0; i < gem.length; i++) {
				term = gem[i];
				if (term.strlit == 'sinatra') {
					return 'sinatra'
				} else if (term.strlit == 'rails') {
					return 'rails';
				} else if (term.strlit == 'padrino') {
					return 'padrino';
				}
			}
			return 'ruby';
		},

		gemInfoToPackageType: function(gemInfo) {
			for (var i = 0; i < gemInfo.length; i++) {
				var item = gemInfo[i];

				// check gems
				//
				if (item['gem']) {
					var gem = item['gem'];
					var packageType = Class.gemToPackageType(gem);
					if (packageType != 'ruby') {
						return packageType;
					}

				// check groups of gems
				//
				} else if (item['group']) {
					var gems = item['gems'];
					for (var j = 0; j < gems.length; j++) {

						// check gems
						//
						var packageType = Class.gemToPackageType(gems[j].gem);
						if (packageType != 'ruby') {
							return packageType;
						}
					}
				}
			}
			return 'ruby';
		},

		gemInfoToRubyVersion: function(gemInfo) {
			for (var i = 0; i < gemInfo.length; i++) {
				var item = gemInfo[i];

				// check ruby info
				//
				if (item['ruby']) {
					return item['ruby'].strlit;
				}
			}
		},

		wheelInfoToPackageType: function(wheelInfo) {
			var packageTypes = [];

			for (var i = 0; i < wheelInfo.length; i++) {
				var item = wheelInfo[i];

				// check key value pairs
				//
				if (item['Tag']) {
					var tag = item['Tag'];

					// check tag
					//
					if (tag.indexOf("py2") != -1) {
						packageTypes['python2'] = true;
					} else if (tag.indexOf("py3") != -1) {
						packageTypes['python3'] = true;
					}
				}
			}

			// python3 takes precedence over python2
			//
			if (packageTypes['python2']) {
				return 'python3';
			} else if (packageTypes['python3']) {
				return 'python2';
			}
		},

		//
		// static ajax methods
		//

		fetch: function(packageVersionUuid, done) {

			// fetch package version
			//
			var packageVersion = new Class({
				package_version_uuid: packageVersionUuid
			});

			packageVersion.fetch({

				// callbacks
				//
				success: function() {
					done(packageVersion);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: 'Could not fetch package version.'
						})
					);
				}
			});
		}
	});

	return Class;
});
