/******************************************************************************\
|                                                                              |
|                               assessment-results.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of assessment results.                  |
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
	'models/utilities/timestamped'
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'assessment_result_uuid',
		urlRoot: Config.servers.web + '/assessment_results',

		//
		// ajax methods
		//

		fetchFile: function(options) {
			$.ajax(_.extend(options, {
				type: 'GET',
				url: this.model.get('file_host') + '/' + this.model.get('file_path'),
				dataType: 'xml',

				// make sure to send credentials
				//
				xhrFields: {
					withCredentials: true
				}
			}));
		},

		fetchResults: function(viewerUuid, projectUuid, options) {
			$.ajax(_.extend(options, {
				type: 'GET',
				url: this.urlRoot + '/' + this.get('assessment_result_uuid') + '/viewer/' + viewerUuid + '/project/' + projectUuid
			}));
		},

		// Refresh status for viewer while launching
		//
		fetchInstanceStatus: function(viewerInstanceUuid, options) {
			$.ajax(_.extend(options, {
				type: 'GET',
				url: this.urlRoot + '/viewer_instance/' + viewerInstanceUuid
			}));
		}
	});
});
