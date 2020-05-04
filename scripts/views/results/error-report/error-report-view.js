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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/results/error-report/error-report.tpl',
	'views/base-view',
	'utilities/web/html-utils'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				package_url: undefined,
				package_version_url: undefined,

				tool_url: undefined,
				tool_version_url: undefined,

				platform_url: undefined,
				platform_version_url: undefined

				/*
				packageUrl: report.package && report.package.package_uuid?
					application.getURL() + '#packages/' + report.package.package_uuid : '',
				packageVersionUrl: report.package && report.package.package_version_uuid?
					application.getURL() + '#packages/versions/' + report.package.package_version_uuid : '',
			
				toolUrl: report.tool && report.tool.tool_uuid?
					application.getURL() + '#tools/' + report.tool.tool_uuid : '',
				toolVersionUrl: report.tool && report.tool.tool_version_uuid?
					application.getURL() + '#tools/versions/' + report.tool.tool_version_uuid : '',

				platformUrl: report.platform && report.platform.platform_uuid?
					application.getURL() + '#platforms/' + report.platform.platform_uuid : '',
				platformVersionUrl: report.platform && report.platform.platform_version_uuid?
					application.getURL() + '#platforms/versions/' + report.platform.platform_version_uuid : '',
				*/
			};
		}
	});
});