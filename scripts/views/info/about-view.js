/******************************************************************************\
|                                                                              |
|                                   about-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the about/information view of the application.           |
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
	'config',
	'text!templates/info/about.tpl',
	'registry',
	'version',
	'utilities/browser/address-bar'
], function($, _, Backbone, Marionette, Config, Template, Registry, Version, AddressBar) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click .subscribe': 'onClickSubscribe'
		},

		//
		// querying methods
		//

		getApiUrl: function() {
			var url = Config.servers.web;

			if (url.startsWith('/')) {
				return AddressBar.get('base') + url.substring(1);
			} else {
				return url;
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				version_string: Version.release + ' build ' + Version.build,
				api_url: this.getApiUrl()
			}));
		},

		//
		// methods
		//

		onShow: function() {

			// scroll to anchor
			//
			if (this.options.anchor) {
				var el = this.$el.find("[name='" + this.options.anchor + "']");
				// el[0].scrollIntoView(true);
				$(document.body).scrollTop(el.offset().top - 36);
			}
		},

		//
		// event handling methods
		//

		onClickSubscribe: function() {
			Backbone.history.navigate('#mailing-list/subscribe', {
				trigger: true
			});
		}
	});
});
