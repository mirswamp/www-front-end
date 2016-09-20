/******************************************************************************\
|                                                                              |
|                          platform-version-profile-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a platform versions's profile information.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/platforms/info/versions/platform-version/platform-version-profile/platform-version-profile.tpl'
], function($, _, Backbone, Marionette, Template) {
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