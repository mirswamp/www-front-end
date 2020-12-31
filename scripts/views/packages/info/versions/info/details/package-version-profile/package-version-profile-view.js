/******************************************************************************\
|                                                                              |
|                          package-version-profile-view.js                     |
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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/versions/info/details/package-version-profile/package-version-profile.tpl',
	'views/base-view',
	'utilities/time/date-utils'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #edit-version': 'onClickEditVersion',
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				package: this.options.package,
				isOwned: this.options.package.isOwned()
			};
		},

		//
		// event handing methods
		//

		onClickEditVersion: function() {

			// go to edit package version details view
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/edit');
		}
	});
});