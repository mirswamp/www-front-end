/******************************************************************************\
|                                                                              |
|                           ssh-info-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that shows how to ssh into a vm.            |
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
	'bootstrap/popover',
	'text!templates/results/assessment-runs/list/dialogs/ssh-info-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Popover, Template, DialogView) {
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
				info: this.options.sshInfo
			};
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});	
		}
	});
});
