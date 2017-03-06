/******************************************************************************\
|                                                                              |
|                           package-version-profile-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a package versions's profile information.      |
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
	'tooltip',
	'popover',
	'text!templates/packages/info/versions/info/details/package-version-profile/package-version-profile.tpl',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #edit-version': 'onClickEditVersion',
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				package: this.options.package,
				isOwned: this.options.package.isOwned()
			}));
		},

		//
		// event handing methods
		//

		onClickEditVersion: function() {

			// go to edit package version details view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/edit', {
				trigger: true
			});
		}
	});
});