/******************************************************************************\
|                                                                              |
|                                 settings-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for displaying the administrator settings.      |
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
	'text!templates/admin/settings/settings.tpl',
	'utilities/scripting/file-utils',
	'views/base-view',
	'views/admin/settings/restricted-domains/restricted-domains-view',
	'views/admin/settings/system-admins/system-admins-view',
	'views/admin/settings/system-email/system-email-view'
], function($, _, Template, FileUtils, BaseView, RestrictedDomainsView, SystemAdminsView, SystemEmailView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			settings: '#settings'
		},

		events: {
			'click #domains': 'onClickDomains',
			'click #admins'	: 'onClickAdmins',
			'click #email' : 'onClickEmail'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				config: application.config
			};
		},

		onRender: function() {

			// update top navigation
			//
			switch (getDirectoryName(this.options.nav)) {
				case 'restricted-domains':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#domains').addClass('active');
					break;
				case 'admins':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#admins').addClass('active');
					break;
				case 'email':
					this.$el.find('.nav li').removeClass('active');
					this.$el.find('.nav li#email').addClass('active');
					break;
			}

			// display subviews
			//
			switch (this.options.nav) {
				case 'restricted-domains':
					this.showChildView('settings', new RestrictedDomainsView());
					break;
				case 'admins':
					this.showChildView('settings', new SystemAdminsView());
					break;
				case 'email':
					this.showChildView('settings', new SystemEmailView());
					break;
			}
		},

		//
		// event handling methods
		//

		onClickDomains: function() {

			// go to restricted domains view
			//
			Backbone.history.navigate('#settings/restricted-domains', {
				trigger: true
			});
		},

		onClickAdmins: function() {

			// go to admins view
			//
			Backbone.history.navigate('#settings/admins', {
				trigger: true
			});
		},

		onClickEmail: function() {

			// go to email settings view
			//
			Backbone.history.navigate('#settings/email', {
				trigger: true
			});
		}
	});
});
