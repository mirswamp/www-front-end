/******************************************************************************\
|                                                                              |
|                               build-script-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a (read-only) view of a package version build script.    |
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
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/info/build/build-script/build-script.tpl',
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		unarchiveCommands: {
			'tar': 						'tar xf',
			'tar.gz': 					'tar xzf',
			'tgz': 						'tar xzf',
			'tar.bz2': 					'tar xjf',
			'tar.xz': 					'tar xJf',
			'tar.Z': 					'tar xzf',
			'zip': 						'unzip',
			'jar': 						'jar -xf'
		},

		packageManagers: [
			'pear'
		],

		buildCommands: {
			'make': 					'make',
			'configure+make':			'make',
			'cmake+make': 				'make',
			'autotools+configure+make': 'make',
			'ant': 						'ant',
			'ant+ivy': 					'ant',
			'android+ant': 				'ant',
			'maven': 					'mvn',
			'android+maven': 			'mvn', 
			'gradle': 					'gradle',
			'android+gradle': 			'gradle',
			'distutils': 				'python',
			'python-setuptools': 		'python',
			'wheels': 					'pip',
			'rake': 					'rake',
			'bundler': 					undefined,
			'bundler+rake': 			'bundle exec rake',
			'bundler+other': 			'bundle exec',
			'npm':						'npm install',
			'composer':					'php /mnt/in/composer.phar install --no-interaction --no-progress',
			'other': 					undefined
		},

		configureCommands: {
			'configure+make':	'configure',
			'cmake+make': 		'cmake'
		},

		//
		// methods to compose build script
		//

		getHighlighted: function(html) {
			return "<span class='highlighted'>" + html + "</span>";
		},

		getUnarchiveCommand: function(packageVersion) {

			function endsWith(str, suffix) {
				return str.indexOf(suffix, str.length - suffix.length) !== -1;
			}

			var filename = packageVersion.getFilename();
			if (filename) {
				for (var fileExtension in this.unarchiveCommands) {
					if (endsWith(filename, fileExtension)) {
						var unarchiveCommand = this.unarchiveCommands[fileExtension];
						return unarchiveCommand + ' ' + filename;
					}
				}
			}
		},

		getConfigureCommand: function(packageVersion) {
			var configureCommand = packageVersion.get('config_cmd');
			var configurePath = packageVersion.get('config_dir');
			var configureOptions = packageVersion.get('config_opt');

			// create default configure command
			//
			if (!configureCommand) {
				var buildSystem = packageVersion.get('build_system');
				configureCommand = this.configureCommands[buildSystem];
			}

			if (configureCommand && configureCommand != '') {

				// add highlighting
				//
				if (this.options.highlight == 'configure-command') {
					configureCommand = this.getHighlighted(configureCommand);
				}

				// add options
				//
				if (configureOptions && configureOptions != '') {

					// add highlighting
					//
					if (this.options.highlight == 'configure-options') {
						configureOptions = this.getHighlighted(configureOptions);
					}

					configureCommand += ' ' + configureOptions;
				}

				// add path
				//
				if (configurePath && configurePath != '') {

					// add highlighting
					//
					if (this.options.highlight == 'configure-path') {
						configurePath = this.getHighlighted(configurePath);
					}

					configureCommand = '(cd ' + configurePath + '; ' + configureCommand + ')';
				}
			}

			return configureCommand;
		},

		getBuildCommand: function(packageVersion) {
			var buildSystem = packageVersion.get('build_system');
			var sourcePath = packageVersion.get('source_path');
			var buildFile = packageVersion.get('build_file');
			var buildDir = packageVersion.get('build_dir');
			var buildOptions = packageVersion.get('build_opt');
			var buildTarget = packageVersion.get('build_target');
			var buildCommand = '';
			var buildFileOption = '';
			var filename;

			// create build command
			//
			if (buildSystem == 'other') {
				buildCommand = packageVersion.get('build_cmd');
			} else if (buildSystem == 'bundler+other') {
				buildCommand = 'bundle exec ' + packageVersion.get('build_cmd');
			} else if (buildSystem.indexOf('+other') != -1) {
				buildCommand = this.buildCommands[buildSystem] +
					'; ' + (packageVersion.has('build_cmd')? packageVersion.get('build_cmd') : '');
			} else {
				buildCommand = this.buildCommands[buildSystem];
			}

			if (buildSystem == 'pear') {
				filename = packageVersion.getFilename();
				buildCommand = "pear config-set php_dir ~/build/user_lib && \ " +
     				"pear install --alldeps --register-only /mnt/in/" + filename;
			}

			// set python version
			//
			if (buildCommand == 'python') {
				buildCommand = this.options.package.getPackageType();
				buildCommand += ' ' + buildFile;
			}

			if (buildCommand) {

				// add default build options
				//
				if (buildCommand == 'pip') {
					filename = this.model.getFilename();
					buildCommand += ' install ' + filename + " && wheel unpack " + filename;
				}

				// add build file
				//
				if (buildFile && buildFile != '') {

					// add highlighting
					//
					if (this.options.highlight == 'build-file') {
						buildFile = this.getHighlighted(buildFile);
					}

					switch (buildCommand) {

						// c/c++ build systems
						//
						case 'make':
						case 'gmake':
							buildFileOption = '-f ' + buildFile;
							break;

						// java build systems
						//
						case 'ant':
							buildFileOption = '-buildfile ' + buildFile;
							break;

						case 'mvn':
							buildFileOption = ' -filename ' + buildFile;
							break;

						// python build systems
						//
						case 'python2':
						case 'python3':
							buildFileOption = buildFile;
							break;

						// ruby build systems
						//
						case 'rake':
						case 'bundle exec rake':
							buildFileOption = ' --rakefile ' + buildFile;
							break;

						// gradle build systems
						//
						case 'gradle':
						case 'android+gradle':
							buildFileOption = ' -b ' + buildFile;
							break;

						// other build systems
						//
						default:
							break;
					}
				}

				/*
				if (buildCommand == 'bundle install') {
					var buildCmd;

					// find build command
					//
					if (buildFile) {
						if (buildDir && !buildDir.endsWith('/')) {
							buildDir += '/';
						}
						buildCmd = (buildDir || '') + buildFile;
					} else if (buildSystem == 'bundler+rake') {
						buildCmd = 'rake';
					}

					// add build options
					//
					if (buildCmd) {
						buildFileOption = ' (cd ' + sourcePath + ';';
						buildFileOption += ' ' + 'bundle exec ' + buildCmd;

						if (buildOptions) {
							buildFileOption += ' ' + buildOptions;
						}
						if (buildTarget) {
							buildFileOption += ' ' + buildTarget;
						}
						buildFileOption += ')';
					}
				}
				*/

				// add highlighting
				//
				if (this.options.highlight == 'build-command' || this.options.highlight == 'other-build-command') {
					buildCommand = this.getHighlighted(buildCommand);
				}

				// add build file options
				//
				if (buildFileOption) {
					buildCommand += (' ' + buildFileOption);
				}

				if (!this.packageManagers.contains(buildSystem)) {

					// add options
					//
					if (buildOptions && buildOptions != '') {

						// add highlighting
						//
						if (this.options.highlight == 'build-options') {
							buildOptions = this.getHighlighted(buildOptions);
						}

						buildCommand += (' ' + buildOptions);
					}

					// add target
					//
					if (buildSystem && !buildSystem.contains('bunder')) {
						if (buildTarget && buildTarget != '') {

							// add highlighting
							//
							if (this.options.highlight == 'build-target' ||
								this.options.highlight == 'other-build-target') {
								buildTarget = this.getHighlighted(buildTarget);
							}

							buildCommand += ' ' + buildTarget;
						}
					}

					// add path
					//
					var buildPath = packageVersion.get('build_dir');
					if (buildPath && buildPath != '') {

						// add highlighting
						//
						if (this.options.highlight == 'build-path') {
							buildPath = this.getHighlighted(buildPath);
						}

						buildCommand = '(cd ' + buildPath + '; ' + buildCommand + ')';
					}
				}
			}
	
			return buildCommand;
		},

		getBuildScript: function(packageVersion) {
			var script = '';
			var newline = '<br />';
			var buildSystem = packageVersion.get('build_system');

			// add unarchive command
			//
			if (!this.packageManagers.contains(buildSystem)) {
				var unarchiveCommand = this.getUnarchiveCommand(packageVersion);
				if (unarchiveCommand) {
					script = unarchiveCommand + ';' + newline;
				}
			}

			// add change directory
			//
			var sourcePath = packageVersion.get('source_path');
			if (sourcePath && sourcePath != '' && !this.packageManagers.contains(buildSystem)) {

				// add highlighting
				//
				if (this.options.highlight == 'package-path') {
					sourcePath = this.getHighlighted(sourcePath);
				}

				// add cd command
				//
				if (sourcePath && sourcePath != '.' && sourcePath != './') {
					script += 'cd \ ' + getDirectoryName(sourcePath) + ';';
					script += newline;
				}
			}

			// add custom shell command
			//
			var customShellCommand = packageVersion.get('custom_shell_cmd');
			if (customShellCommand && customShellCommand != '') {

				// add highlighting
				//
				if (this.options.highlight == 'build-command') {
					customShellCommand = this.getHighlighted(customShellCommand);
				}

				script += customShellCommand;
				script += newline;	
			}

			// add android redo build command
			//
			if (packageVersion.get('android_redo_build')) {
				var redoBuildCommand = 'rm -f build.xml';

				// add highlighting
				//
				if (this.options.highlight == 'android-redo-build') {
					redoBuildCommand = this.getHighlighted(redoBuildCommand);
				}

				script += redoBuildCommand;
				script += newline;
			}

			// add android update command
			//
			var packageType = this.options.package.getPackageType();
			if (packageType == 'android-source') {
				script += 'android update project -p . -s';
				if (this.model.get('android_sdk_target')) {
					var androidSDKTarget = this.model.get('android_sdk_target');
					if (this.options.highlight == 'android-sdk-target') {
						androidSDKTarget = this.getHighlighted(androidSDKTarget);
					}			
					script += ' -t ' + "'" + androidSDKTarget + "'";
				}
				script += newline;
			}

			// add configure command
			//
			var configureCommand = this.getConfigureCommand(packageVersion);
			if (configureCommand && configureCommand != '') {
				script += configureCommand;
				script += newline;	
			}

			// add bundle command
			//
			buildSystem = packageVersion.get('build_system');
			if (buildSystem && buildSystem.contains('bundler')) {
				script += 'bundle install';
				script += newline;
			}

			// add gradle wrapper command
			//
			if (buildSystem == 'gradle' || buildSystem == 'android+gradle') {
				if (packageVersion.get('use_gradle_wrapper')) {
					if (this.options.highlight == 'use-gradle-wrapper') {
						script += this.getHighlighted('gradlew');
					} else {
						script += 'gradlew';
					}
					script += newline;
				}
			}

			// add no build command
			//
			if (!buildSystem || buildSystem == 'no-build' || buildSystem == 'none') {
				if (packageVersion.has('no_build_cmd')) {
					script += packageVersion.get('no_build_cmd').replace(/;/g, '; <br />');
				}
				
			// add build command
			//
			} else {
				var buildCommand = this.getBuildCommand(packageVersion);
				if (buildCommand && buildCommand != '') {
					script += buildCommand;
					script += newline;
				}
			}

			return script;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				buildScript: this.getBuildScript(this.model)
			}));
		}
	});
});
