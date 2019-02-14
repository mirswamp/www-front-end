/******************************************************************************\
|                                                                              |
|                         platform-versions-list-item-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a platform versions list item.        |
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
	'text!templates/platforms/info/versions/platform-versions-list/platform-versions-list-item.tpl',
	'registry',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				url: Registry.application.session.user? Registry.application.getURL() + '#platforms/versions/' + this.model.get('platform_version_uuid') : undefined,
				showDelete: false
			}));
		}
	});
});