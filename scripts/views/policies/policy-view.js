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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'tooltip',
	'popover',
	'text!templates/policies/policy-view.tpl'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template) {
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
					self.$el.find('#policy').html(policyText);

					self.$el.find('a[data-toggle]').popover({
						trigger: 'click'
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
