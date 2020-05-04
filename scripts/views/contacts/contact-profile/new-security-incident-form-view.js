/******************************************************************************\
|                                                                              |
|                      new-security-incident-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering new contact profile info.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'views/contacts/contact-profile/new-contact-profile-form-view'
], function($, _, NewContactProfileFormView) {
	return NewContactProfileFormView.extend({

		//
		// form methods
		//

		getValues: function() {
			return _.extend({
				'topic': 'security'
			}, NewContactProfileFormView.prototype.getValues.call(this));
		}
	});
});
