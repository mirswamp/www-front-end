/******************************************************************************\
|                                                                              |
|                                  tool-versions.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of tool versions.                      |                                                  |
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
	'models/tools/tool-version',
	'collections/utilities/versions'
], function($, _, Config, ToolVersion, Versions) {
	return Versions.extend({

		//
		// Backbone attributes
		//

		model: ToolVersion,

		//
		// ajax methods
		//

		fetchByTool: function(tool, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/tools/' + tool.get('tool_uuid') + '/versions'
			}));
		},

		fetchByToolAndPackageType: function(tool, packageType, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/tools/' + tool.get('tool_uuid') + '/versions',
				data: {
					'package-type': packageType
				}
			}));
		}
	});
});