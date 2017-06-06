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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'registry',
	'models/utilities/timestamped',
	'models/packages/package-version',
	'collections/packages/package-versions',
	'collections/platforms/platforms',
	'collections/platforms/platform-versions',
	'views/dialogs/error-view'
], function($, _, Config, Registry, Timestamped, PackageVersion, PackageVersions, Platforms, PlatformVersions, ErrorView) {
	var Class = Timestamped.extend({

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

		hasValidExternalUrl: function() {
			var re = /^https:\/\/github.com\/.+\/.+.git$/;
			var url = this.has('external_url') ? this.get('external_url').toLowerCase() : '';
			return re.test( url );
		},

		isPlatformUserSelectable: function() {
			return this.get('platform_user_selectable') == '1';
		},

		getPackageType: function() {
			return Class.toPackageType(this.get('package_type_id'));
		},

		getLanguageType: function() {
			return Class.toLanguageType(this.get('package_type_id'));
		},

		getPackageTypeName: function() {
			return Class.packageTypeToName(Class.toPackageType(this.get('package_type_id')));
		},

		hasLanguageVersion: function() {
			return this.getPackageType() == 'ruby';
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

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			var response = Timestamped.prototype.parse.call(this, response);

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
					break;
				case 2:
					return 'java7-source';
					break;
				case 3:
					return 'java7-bytecode';
					break;
				case 4:
					return 'python2';
					break;
				case 5:
					return 'python3'
					break;
				case 6:
					return 'android-source';
					break;
				case 7:
					return 'ruby';
					break;
				case 8:
					return 'sinatra';
					break;
				case 9:
					return 'rails';
					break;
				case 10:
					return 'padrino';
					break;
				case 11:
					return 'android-bytecode';
					break;
				case 12:
					return 'java8-source';
					break;
				case 13:
					return 'java8-bytecode';
					break;
				case 14:
					return 'web-scripting';
					break;
			}
		},

		toPackageTypeId: function(packageType) {
			switch (packageType) {
				case 'c-source':
					return 1;
					break;
				case 'java7-source':
					return 2;
					break;
				case 'java7-bytecode':
					return 3;
					break;
				case 'python2':
					return 4;
					break;
				case 'python3':
					return 5
					break;
				case 'android-source':
					return 6;
					break;
				case 'ruby':
					return 7;
					break;
				case 'sinatra':
					return 8;
					break;
				case 'rails':
					return 9;
					break;
				case 'padrino':
					return 10;
					break;
				case 'android-bytecode':
					return 11;
					break;
				case 'java8-source':
					return 12;
					break;
				case 'java8-bytecode':
					return 13;
					break;
				case 'web-scripting':
					return 14;
					break;
			}
		},

		toLanguageType: function(packageType) {
			switch (packageType) {
				case 'c-source':
					return 'C';
					break;
				case 'java7-source':
					return 'Java';
					break;
				case 'java7-bytecode':
					return 'Java';
					break;
				case 'python2':
					return 'Python';
					break;
				case 'python3':
					return 'Python'
					break;
				case 'android-source':
					return 'Java';
					break;
				case 'ruby':
					return 'Ruby';
					break;
				case 'sinatra':
					return 'Ruby';
					break;
				case 'rails':
					return 'Ruby';
					break;
				case 'padrino':
					return 'Ruby';
					break;
				case 'android-bytecode':
					return 'Java';
					break;
				case 'java8-source':
					return 'Java';
					break;
				case 'java8-bytecode':
					return 'Java';
					break;
				case 'web-scripting':
					return ['HTML', 'Javascript', 'PHP', 'CSS', 'XML'];
					break;
			}
		},

		packageTypeToName: function(packageType) {
			switch (packageType) {
				case 'c-source':
					return 'C/C++';
					break;
				case 'java-source':
					return 'Java source';
					break;
				case 'java7-source':
					return 'Java 7 source';
					break;
				case 'java-bytecode':
					return 'Java bytecode';
					break;
				case 'java7-bytecode':
					return 'Java 7 bytecode';
					break;
				case 'python':
					return 'Python';
					break;
				case 'python2':
					return 'Python2';
					break;
				case 'python3':
					return 'Python3';
					break;
				case 'ruby':
					return 'Ruby';
					break;
				case 'sinatra':
					return 'Sinatra';
					break;
				case 'rails':
					return 'Rails';
					break;
				case 'padrino':
					return 'Padrino';
					break;
				case 'android-source':
					return 'Android source';
					break;
				case 'android-bytecode':
					return 'Android bytecode';
					break;
				case 'java8-source':
					return 'Java 8 source';
					break;
				case 'java8-bytecode':
					return 'Java 8 bytecode';
					break;
				case 'web-scripting':
					return 'Web scripting';
					break;
			}		
		},

		packageTypesToString: function(packageTypes) {
			var string = '';
			for (var i = 0; i < packageTypes.length; i++) {
				if (i > 0) {
					if (i == packageTypes.length - 1) {
						string += " or ";
					} else {
						string += ", "
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
