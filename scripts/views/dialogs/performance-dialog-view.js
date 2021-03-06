/******************************************************************************\
|                                                                              |
|                               performance-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is used to show the application        |
|        loading time performance.                                             |
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
	'text!templates/dialogs/performance-dialog.tpl',
	'widgets/accordions',
	'views/dialogs/dialog-view'
], function($, _, Template, Accordions, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				timing: window.timing,
				collapsed: true
			};
		},

		onRender: function() {

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		}
	});
});
