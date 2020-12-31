/******************************************************************************\
|                                                                              |
|                        project-ownership-status-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box for displaying the project ownership        |
|        status of the current user.                                           |
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
	'text!templates/users/dialogs/project-ownership/project-ownership-status-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Template, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .link': 'onClickLink',
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return { 
				project_owner_permission: this.model
			};
		},

		//
		// event handling methods
		//

		onClickLink: function(){

			// close dialog
			//
			this.hide();
		}
	});
});
