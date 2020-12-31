/******************************************************************************\
|                                                                              |
|                          source-files-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is used to show a list of source       |
|        files.                                                                |
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
	'text!templates/packages/dialogs/source-files-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Template, DialogView) {
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
				title: 'Source Files for ' + this.options.package.get('name') + ' '  + this.model.get('version_string'),
				source_files: this.model.get('source_files')
			};
		}
	});
});
