/******************************************************************************\
|                                                                              |
|                           tool-version-profile-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a tool versions's profile information.         |
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
	'bootstrap/tooltip',
	'bootstrap/popover',
	'text!templates/tools/info/versions/tool-version/tool-version-profile/tool-version-profile.tpl',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		}
	});
});