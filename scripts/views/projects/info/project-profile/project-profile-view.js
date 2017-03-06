/******************************************************************************\
|                                                                              |
|                              project-profile-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a project's profile information.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/projects/info/project-profile/project-profile.tpl',
	'registry',
	'models/viewers/viewer',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Template, Registry, Viewer) {
	return Backbone.Marionette.ItemView.extend({

		//
		// rendering methods
		//
		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				config: Registry.application.config
			}));
		}
	});
});
