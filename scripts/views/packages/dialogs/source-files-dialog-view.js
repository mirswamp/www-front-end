/******************************************************************************\
|                                                                              |
|                          source-files-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        list of source files.                                                 |
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
	'text!templates/packages/dialogs/source-files-dialog.tpl'
], function($, _, Backbone, Marionette, Template) {
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
				title: 'Source Files for ' + this.options.package.get('name') + ' '  + this.model.get('version_string'),
				source_files: this.model.get('source_files')
			});
		}
	});
});
