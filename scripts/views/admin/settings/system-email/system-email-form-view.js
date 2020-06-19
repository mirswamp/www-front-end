/******************************************************************************\
|                                                                              |
|                          system-email-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for sending system emails.                        |
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
	'text!templates/admin/settings/system-email/system-email-form.tpl',
	'views/forms/form-view',
], function($, _, Template, FormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// form querying methods
		//

		getValue: function(key) {
			switch (key) {
				case 'subject':
					return this.$el.find('.email-subject input').val();
				case 'body':
					return this.$el.find('.email-body textarea').val();
			}
		},
		
		getValues: function() {
			return {
				subject: this.getValue('subject'),
				body: this.getValud('body')
			};
		}
	});
});
