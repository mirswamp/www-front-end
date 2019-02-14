/******************************************************************************\
|                                                                              |
|                           project-ownership-status-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for displaying the project ownership            |
|        status of the current user.                                           |
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
	'text!templates/users/dialogs/project-ownership/project-ownership-status.tpl',
	'registry',
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.LayoutView.extend({

		events: {
			'click .link': 'onClickLink',
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, { 
				project_owner_permission: this.model
			});
		},

		onClickLink: function(){
			Registry.application.modal.hide();
		}
	});
});
