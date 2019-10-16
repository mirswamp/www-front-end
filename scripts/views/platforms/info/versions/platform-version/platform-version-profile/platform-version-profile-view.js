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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/platforms/info/versions/platform-version/platform-version-profile/platform-version-profile.tpl',
	'views/base-view',
	'utilities/time/date-utils'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model
			};
		}
	});
});