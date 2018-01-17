/******************************************************************************\
|                                                                              |
|                                   viewer.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an application result viewer.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config'
], function($, _, Backbone, Config) {
	return Backbone.Model.extend({

		//
		// querying methods
		//

		isNative: function() {
			return this.get('name').toLowerCase().indexOf('native') != -1;
		},

		//
		// ajax methods
		//

		getDefaultViewer: function(options) {
			this.fetch( _.extend(options, {
				url: Config.servers.web + '/viewers/default/' + this.get('project_uid')
			}));
		},

		setDefaultViewer: function(viewerUuid, options) {
			$.ajax(_.extend(options, {
				method: 'PUT',
				url: Config.servers.web + '/viewers/default/' + this.get('project_uid') + '/viewer/' + viewerUuid
			}));
		},

		checkPermission: function(assessmentResultUuids, projectUuid, options) {
			$.ajax(_.extend(options, {
				type: 'GET',
				url: Config.servers.web + '/assessment_results/' + (assessmentResultUuids? assessmentResultUuids : 'none') + 
					'/viewer/' + this.get('viewer_uuid') + 
					'/project/' + projectUuid + 
					'/permission'
			}));
		}
	});
});
