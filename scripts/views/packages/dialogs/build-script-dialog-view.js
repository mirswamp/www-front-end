/******************************************************************************\
|                                                                              |
|                          build-script-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        build script.                                                         |
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
	'text!templates/packages/dialogs/build-script-dialog.tpl',
	'views/packages/info/versions/info/build/build-script/build-script-view'
], function($, _, Backbone, Marionette, Template, BuildScriptView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			buildScript: '#build-script'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: 'Build Script for ' + this.options.package.get('name') + ' '  + this.model.get('version_string')
			});
		},

		onRender: function() {

			// show build script
			//
			this.buildScript.show(
				new BuildScriptView({
					model: this.model,
					package: this.options.package
				})
			);
		}
	});
});
