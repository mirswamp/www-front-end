/******************************************************************************\
|                                                                              |
|                               error-report-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying assessment errors.                 |
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
	'widgets/accordions',
	'views/base-view',
	'utilities/web/html-utils'
], function($, _, Template, Accordions, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// querying methods
		//

		getPackageUrl: function() {
			if (this.model.has('package')) {
				return application.getURL() + '#packages/' + this.model.get('package').package_uuid;
			}
		},

		getPackageVersionUrl: function() {
			if (this.model.has('package')) {
				return application.getURL() + '#packages/versions/' + this.model.get('package').package_version_uuid;
			}
		},

		getToolUrl: function() {
			if (this.model.has('tool')) {
				return application.getURL() + '#tools/' + this.model.get('tool').tool_uuid;
			}
		},

		getToolVersionUrl: function() {
			if (this.model.has('tool')) {
				return application.getURL() + '#tools/versions/' + this.model.get('tool').tool_version_uuid;
			}
		},

		getPlatformUrl: function() {
			if (this.model.has('platform')) {
				return application.getURL() + '#platforms/' + this.model.get('platform').platform_uuid;
			}
		},

		getPlatformVersionUrl: function() {
			if (this.model.has('platform')) {
				return application.getURL() + '#platforms/versions/' + this.model.get('platform').platform_version_uuid;
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				package_url: this.getPackageUrl(),
				package_version_url: this.getPackageVersionUrl(),

				tool_url: this.getToolUrl(),
				tool_version_url: this.getToolVersionUrl(),
				
				platform_url: this.getPlatformUrl(),
				platform_version_url: this.getPlatformVersionUrl(),
			};
		},

		onRender: function() {

			// change collapse icons
			//
			new Accordions(this.$el.find('.form-group'));
		}
	});
});