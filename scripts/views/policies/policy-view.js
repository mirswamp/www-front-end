/******************************************************************************\
|                                                                              |
|                                   policy-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the generic policy view used to view all policies        |
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
	'bootstrap/tooltip',
	'bootstrap/popover',
	'text!templates/policies/policy-view.tpl',
	'utilities/security/password-policy',
], function($, _, Backbone, Marionette, Tooltip, Popover, Template, PasswordPolicy) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				policyTitle: this.options.policyTitle,
				policyText: this.options.policyText
			}));
		},

		onRender: function() {
			var self = this;

			if (this.options.template_file) {
				
				// get policy from file
				//
				require([this.options.template_file], function(policyText) {

					// evaluate template
					//
					var text = _.template(policyText, {
						passwordPolicy: passwordPolicy
					});

					// show evaluated template
					//
					self.$el.find('#policy').html(text);

					// show popovers on hover
					//
					self.$el.find('a[data-toggle]').popover({
						trigger: 'hover'
					});
				}, function(err) {
					Backbone.history.navigate('#home', {
						trigger: true
					});
				});
			}
		}
	});
});
