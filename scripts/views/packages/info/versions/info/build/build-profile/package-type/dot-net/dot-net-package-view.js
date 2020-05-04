/******************************************************************************\
|                                                                              |
|                             dot-net-package-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a non-editable view of a package versions's              |
|        language / type specific profile information.                         |
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
	'bootstrap/collapse',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/dot-net/dot-net-package.tpl',
	'views/base-view',
	'widgets/accordions',
	'utilities/web/html-utils'
], function($, _, Collapse, Template, BaseView, Accordions) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// querying methods
		//

		getSolution: function(settings) {
			var package_build_settings = this.model.get('package_build_settings');
			if (package_build_settings.sln_files) {
				var solutions = package_build_settings.sln_files[0];
				if (solutions) {
					return Object.keys(solutions)[0];
				}
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			var settings = this.model.get('package_build_settings');

			return {
				solution: this.getSolution(settings),
				projects: settings.proj_files
			};
		},

		onRender: function() {
			
			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		}
	});
});
