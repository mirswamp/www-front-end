/******************************************************************************\
|                                                                              |
|                                    ssh-info-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog that shows info on how to ssh into a vm.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/popover',
	'text!templates/assessment-results/assessment-runs/list/dialogs/ssh-info.tpl'
], function($, _, Backbone, Marionette, Popover, Template) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				info: this.options.sshInfo
			});
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
