/******************************************************************************\
|                                                                              |
|                               error-report-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the native viewer for displaying assessment results.     |
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
	'text!templates/results/error-report/error-report.tpl',
	'registry',
	'utilities/browser/html-utils'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				package_url: undefined,
				package_version_url: undefined,

				tool_url: undefined,
				tool_version_url: undefined,

				platform_url: undefined,
				platform_version_url: undefined

				/*
				packageUrl: report.package && report.package.package_uuid?
					Registry.application.getURL() + '#packages/' + report.package.package_uuid : '',
				packageVersionUrl: report.package && report.package.package_version_uuid?
					Registry.application.getURL() + '#packages/versions/' + report.package.package_version_uuid : '',
			
				toolUrl: report.tool && report.tool.tool_uuid?
					Registry.application.getURL() + '#tools/' + report.tool.tool_uuid : '',
				toolVersionUrl: report.tool && report.tool.tool_version_uuid?
					Registry.application.getURL() + '#tools/versions/' + report.tool.tool_version_uuid : '',

				platformUrl: report.platform && report.platform.platform_uuid?
					Registry.application.getURL() + '#platforms/' + report.platform.platform_uuid : '',
				platformVersionUrl: report.platform && report.platform.platform_version_uuid?
					Registry.application.getURL() + '#platforms/versions/' + report.platform.platform_version_uuid : '',
				*/
			}));
		}
	});
});