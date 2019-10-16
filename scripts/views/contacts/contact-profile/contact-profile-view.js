/******************************************************************************\
|                                                                              |
|                              contact-profile-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of the contact/feedback information.              |
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
	'text!templates/contacts/contact-profile/contact-profile.tpl',
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
