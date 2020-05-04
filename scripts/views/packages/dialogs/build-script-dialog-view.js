/******************************************************************************\
|                                                                              |
|                          build-script-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is used to show a build script.        |
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
	'text!templates/packages/dialogs/build-script-dialog.tpl',
	'views/dialogs/dialog-view',
	'views/packages/info/versions/info/build/build-script/build-script-view'
], function($, _, Template, DialogView, BuildScriptView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			build_script: '#build-script'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: 'Build Script for ' + this.options.package.get('name') + ' '  + this.model.get('version_string')
			};
		},

		onRender: function() {

			// show build script
			//
			this.showChildView('build_script', new BuildScriptView({
				model: this.model,
				package: this.options.package
			}));
		}
	});
});
