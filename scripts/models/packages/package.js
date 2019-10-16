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
	'defaults',
	'models/utilities/timestamped',
	'models/packages/package-version',
	'collections/packages/package-versions',
	'collections/projects/projects',
	'collections/platforms/platforms',
	'collections/platforms/platform-versions',
	'utilities/scripting/file-utils'
], function($, _, Config, Defaults, Timestamped, PackageVersion, PackageVersions, Projects, Platforms, PlatformVersions) {
	return Timestamped.extend({

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
			return this.constructor.toPackageType(this.get('package_type_id'));
		},

		getLanguageType: function() {
			return this.constructor.toLanguageType(this.getPackageType());
		},

		getPackageTypeName: function() {
			return this.constructor.packageTypeToName(this.constructor.toPackageType(this.get('package_type_id')));
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
			var package = new this.prototype.constructor({
				package_uuid: packageUuid
			});

			package.fetch({

				// callbacks
				//
				success: function() {
					done(package);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch package."
					});
				}
			});
		},

		toPackageType: function(packageTypeId) {
			if (packageTypeId) {
				var keys = Object.keys(Defaults['package-types']);
				return keys[packageTypeId - 1];
			}
		},

		toPackageTypeId: function(packageType) {
			if (packageType) {
				var keys = Object.keys(Defaults['package-types']);
				return keys.indexOf(packageType) + 1;
			}
		},

		toLanguageType: function(packageType) {
			if (packageType) {
				packageType = this.aliasToPackageType(packageType);
				return Defaults['package-types'][packageType].language;
			}
		},

		packageTypeToName: function(packageType) {
			if (packageType) {
				packageType = this.aliasToPackageType(packageType);
				return Defaults['package-types'][packageType].name;
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
				string += this.packageTypeToName(packageTypes[i]);
			}
			return string;
		},

		//
		// package type alias handling methods
		//

		aliasToPackageType: function(string) {
			if (string == 'python') {
				return 'python2';
			} else if (string == 'java-source') {
				return 'java8-source';
			} else if (string == 'java-bytecode') {
				return 'java8-bytecode';
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
});
