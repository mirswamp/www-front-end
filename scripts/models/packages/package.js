/******************************************************************************\
|                                                                              |
|                                      package.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a software package to be analysed.            |
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
	'config',
	'registry',
	'models/utilities/timestamped',
	'models/packages/package-version',
	'collections/packages/package-versions',
	'collections/projects/projects',
	'collections/platforms/platforms',
	'collections/platforms/platform-versions',
	'views/dialogs/error-view',
	'utilities/scripting/file-utils'
], function($, _, Config, Registry, Timestamped, PackageVersion, PackageVersions, Projects, Platforms, PlatformVersions, ErrorView) {
	var Class = Timestamped.extend({

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

		idAttribute: 'package_uuid',
		urlRoot: Config.servers.web + '/packages',

		//
		// querying methods
		//

		isOwned: function() {
			return this.get('is_owned');
		},

		isOwnedBy: function(user) {
			if (user && this.has('package_owner')) {
				return user.get('user_uid') == this.get('package_owner').user_uid;
			}
		},

		isDeactivated: function() {
			return (this.hasDeleteDate());
		},

		hasValidArchiveUrl: function() {
			return this.has('external_url') && this.constructor.isValidArchiveName(this.get('external_url'));
		},

		hasValidExternalUrl: function() {
			var re = /^https:\/\/github.com\/.+\/.+.git$/;
			var url = this.has('external_url') ? this.get('external_url').toLowerCase() : '';
			return re.test( url );
		},

		isPlatformUserSelectable: function() {
			return this.get('platform_user_selectable') != false;
		},

		getPackageType: function() {
			return Class.toPackageType(this.get('package_type_id'));
		},

		getLanguageType: function() {
			return Class.toLanguageType(this.getPackageType());
		},

		getPackageTypeName: function() {
			return Class.packageTypeToName(Class.toPackageType(this.get('package_type_id')));
		},

		hasLanguageVersion: function() {
			return this.getPackageType() == 'ruby';
		},

		isBuildable: function() {
			return !['ruby', 'sinatra', 'rails', 'padrino', 'python', 'python2', 'python3', 'web-scripting'].contains(this.getPackageType());
		},

		hasBuildScript: function() {
			return !['.net', 'java-bytecode', 'java7-bytecode', 'java8-bytecode'].contains(this.getPackageType());
		},

		//
		// scoping methods
		//

		isPublic: function() {
			return this.has('package_sharing_status') &&
				this.get('package_sharing_status').toLowerCase() == 'public';
		},

		isPrivate: function() {
			return this.has('package_sharing_status') &&
				this.get('package_sharing_status').toLowerCase() == 'private';
		},

		isProtected: function() {
			return this.has('package_sharing_status') &&
				this.get('package_sharing_status').toLowerCase() == 'protected';
		},

		//
		// ajax methods
		//

		fetchLatestVersion: function(done) {

			// get existing package versions
			//
			var packageVersions = new PackageVersions();
			packageVersions.fetchByPackage(this, {

				// callbacks
				//
				success: function() {
 
					// sort by version string
					//
					packageVersions.sortByAttribute('version_string', {
						reverse: true,
						comparator: function(versionString) {
							return PackageVersion.comparator(versionString);
						}
					});

					// return latest version
					//
					done(packageVersions.at(0));
				},

				error: function() {
					done();					
				}
			});
		},

		//
		// ajax sharing methods
		//

		fetchSharedProjects: function(options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + this.get('package_uuid') + '/sharing',
				type: 'GET'
			}));
		},

		saveSharedProjects: function(projects, options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + this.get('package_uuid') + '/sharing',
				type: 'PUT',
				dataType: 'JSON',
				data: {
					//'projects': projects.toJSON()
					'project_uuids': projects.getUuids()
				}
			}));
		},

		applySharing: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/packages/' + this.get('package_uuid') + '/sharing/apply-all',
				type: 'POST'
			}));
		},

		//
		// ajax compatibility methods
		//

		fetchCompatiblePlatforms: function(options) {
			$.ajax(_.extend(_.extend({}, options), {
				url: this.urlRoot + '/' + this.get('package_uuid') + '/platforms',
				type: 'GET',

				success: function(data) {
					if (options.success) {
						options.success(new Platforms(data));
					}
				}
			}));		
		},

		fetchCompatiblePlatformVersions: function(options) {
			$.ajax(_.extend(_.extend({}, options), {
				url: this.urlRoot + '/' + this.get('package_uuid') + '/platforms/versions',
				type: 'GET',

				success: function(data) {
					if (options.success) {
						options.success(new PlatformVersions(data));
					}
				}
			}));		
		},

		fetchIncompatiblePlatforms: function(options) {
			$.ajax(_.extend(_.extend({}, options), {
				url: this.urlRoot + '/' + this.get('package_uuid') + '/platforms/incompatible',
				type: 'GET',

				success: function(data) {
					if (options.success) {
						options.success(new Platforms(data));
					}
				}
			}));		
		},

		fetchIncompatiblePlatformVersions: function(options) {
			$.ajax(_.extend(_.extend({}, options), {
				url: this.urlRoot + '/' + this.get('package_uuid') + '/platforms/versions/incompatible',
				type: 'GET',

				success: function(data) {
					if (options.success) {
						options.success(new PlatformVersions(data));
					}
				}
			}));		
		},

		fetchProjects: function(options) {
			$.ajax(_.extend(_.extend({}, options), {
				url: this.urlRoot + '/' + this.get('package_uuid') + '/projects',
				type: 'GET',

				success: function(data) {
					if (options.success) {
						options.success(new Projects(data, {
							parse: true
						}));
					}
				}
			}));		
		},

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			response = Timestamped.prototype.parse.call(this, response);

			// convert package type id to an integer
			//
			if (response.package_type_id) {
				response.package_type_id = parseInt(response.package_type_id);
			}

			// convert package languages to an array
			//
			if (response.package_language) {
				response.package_language = response.package_language.split(' ');
			}

			return response;
		}
	}, {
		
		//
		// static methods
		//

		isValidArchiveName: function(fileName) {

			// check allowed extensions
			//
			if (fileName) {
				for (var i = 0; i < this.prototype.allowedExtensions.length; i++) {
					if (fileName.endsWith(this.prototype.allowedExtensions[i])) {
						return true;
					}
				}
			}

			return false;
		},

		isValidGitUrl: function(url) {
			if (url) {
				var extension = getFileExtension(url);
				return (extension == 'git' || extension == null);
			} else {
				return false;
			}
		},

		fetch: function(packageUuid, done) {

			// fetch package
			//
			var package = new Class({
				package_uuid: packageUuid
			});

			package.fetch({

				// callbacks
				//
				success: function() {
					done(package);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch package."
						})
					);
				}
			});
		},

		toPackageType: function(packageTypeId) {
			switch (packageTypeId) {
				case 1:
					return 'c-source';
				case 2:
					return 'java7-source';
				case 3:
					return 'java7-bytecode';
				case 4:
					return 'python2';
				case 5:
					return 'python3';
				case 6:
					return 'android-source';
				case 7:
					return 'ruby';
				case 8:
					return 'sinatra';
				case 9:
					return 'rails';
				case 10:
					return 'padrino';
				case 11:
					return 'android-bytecode';
				case 12:
					return 'java8-source';
				case 13:
					return 'java8-bytecode';
				case 14:
					return 'web-scripting';
				case 15:
					return '.net';
			}
		},

		toPackageTypeId: function(packageType) {
			switch (packageType) {
				case 'c-source':
					return 1;
				case 'java7-source':
					return 2;
				case 'java7-bytecode':
					return 3;
				case 'python2':
					return 4;
				case 'python3':
					return 5;
				case 'android-source':
					return 6;
				case 'ruby':
					return 7;
				case 'sinatra':
					return 8;
				case 'rails':
					return 9;
				case 'padrino':
					return 10;
				case 'android-bytecode':
					return 11;
				case 'java8-source':
					return 12;
				case 'java8-bytecode':
					return 13;
				case 'web-scripting':
					return 14;
				case '.net':
					return 15;
			}
		},

		toLanguageType: function(packageType) {
			switch (packageType) {
				case 'c-source':
					return 'C';
				case 'java7-source':
					return 'Java';
				case 'java7-bytecode':
					return 'Java';
				case 'python2':
					return 'Python';
				case 'python3':
					return 'Python';
				case 'android-source':
					return 'Java';
				case 'ruby':
					return 'Ruby';
				case 'sinatra':
					return 'Ruby';
				case 'rails':
					return 'Ruby';
				case 'padrino':
					return 'Ruby';
				case 'android-bytecode':
					return 'Java';
				case 'java8-source':
					return 'Java';
				case 'java8-bytecode':
					return 'Java';
				case 'web-scripting':
					return ['HTML', 'Javascript', 'PHP', 'CSS', 'XML'];
				case '.net':
					return 'C#, VB';
			}
		},

		packageTypeToName: function(packageType) {
			switch (packageType) {
				case 'c-source':
					return 'C/C++';
				case 'java-source':
					return 'Java source';
				case 'java7-source':
					return 'Java 7 source';
				case 'java-bytecode':
					return 'Java bytecode';
				case 'java7-bytecode':
					return 'Java 7 bytecode';
				case 'python':
					return 'Python';
				case 'python2':
					return 'Python2';
				case 'python3':
					return 'Python3';
				case 'ruby':
					return 'Ruby';
				case 'sinatra':
					return 'Sinatra';
				case 'rails':
					return 'Rails';
				case 'padrino':
					return 'Padrino';
				case 'android-source':
					return 'Android source';
				case 'android-bytecode':
					return 'Android bytecode';
				case 'java8-source':
					return 'Java 8 source';
				case 'java8-bytecode':
					return 'Java 8 bytecode';
				case 'web-scripting':
					return 'Web scripting';
				case '.net':
					return '.NET';
			}		
		},

		packageTypesToString: function(packageTypes) {
			var string = '';
			for (var i = 0; i < packageTypes.length; i++) {
				if (i > 0) {
					if (i == packageTypes.length - 1) {
						string += " or ";
					} else {
						string += ", ";
					}
				} 
				string += Class.packageTypeToName(packageTypes[i]);
			}
			return string;
		},

		getTypeAlias: function(packageType) {
			switch (packageType) {

				// python aliases
				//
				case 'python2':
				case 'python3':
					return 'python';

				// java source aliases
				//
				case 'java7-source':
				case 'java8-source':
				case 'android-source':
					return 'java-source';

				// java bytecode aliases
				//
				case 'java7-bytecode':
				case 'java8-bytecode':
					return 'java-bytecode';

				default:
					return packageType;
			}
		}
	});

	return Class;
});
