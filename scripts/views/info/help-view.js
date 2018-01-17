/******************************************************************************\
|                                                                              |
|                                   help-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the help/information view of the application.            |
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
	'text!templates/info/help.tpl',
	'config',
	'registry',
], function($, _, Backbone, Marionette, Template, Config, Registry) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				contact: Config.contact,
				config: Registry.application.config
			}));
		},
	});
});
