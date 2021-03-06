/******************************************************************************\
|                                                                              |
|                                  tool-version.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a version of a software assessment tool.                 |
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
	'models/utilities/shared-version',
], function($, _, Config, SharedVersion) {
	return SharedVersion.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'tool_version_uuid',
		urlRoot: Config.servers.web + '/tools/versions',

		//
		// querying methods
		//

		supports: function(packageTypeName) {
			if (this.has('package_type_names')) {
				var names = this.get('package_type_names');

				// check to see if package type is in list of names
				//
				var found = false;
				for (var i = 0; i < names.length; i++) {
					if (packageTypeName == names[i]) {
						return true;
					}
				}

				// not found in list
				//
				return false;
			} else {

				// no package type names attribute
				//
				return false;
			}
		},

		getAppUrl: function() {
			return application.getURL() + '#tools/versions' + this.get('tool_version_uuid');
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
						myXhr.upload.addEventListener('progress', function(){}, false); 
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

		add: function(options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + this.get('tool_version_uuid') + '/add',
				type: 'POST'
			}));	
		}
	}, {

		//
		// static methods
		//

		fetch: function(toolVersionUuid, done) {

			// fetch tool version
			//
			var toolVersion = new this.prototype.constructor({
				tool_version_uuid: toolVersionUuid
			});

			toolVersion.fetch({

				// callbacks
				//
				success: function() {
					done(toolVersion);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch tool version."
					});
				}
			});
		}
	});
});