/******************************************************************************\
|                                                                              |
|                                one-column-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the layout for a one column (top bar + main) view.       |
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
	'bootstrap/affix',
	'text!templates/layout/one-column-top-navbar.tpl',
	'text!templates/layout/one-column-bottom-navbar.tpl',
	'registry',
	'models/projects/project',
	'views/layout/navbar-view'
], function($, _, Backbone, Marionette, Affix, TemplateTopNavbar, TemplateBottomNavbar, Registry, Project, NavbarView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			navbar: '.navbar',
			content: '.content'
		},

		//
		// methods
		//

		initialize: function() {
			this.model = new Project();
		},

		//
		// rendering methods
		//

		template: function(data) {

			// use top or bottom template
			//
			switch (this.options.navbarOrientation) {
				case 'top':
					var template = TemplateTopNavbar;
					break;
				case 'bottom':
					var template = TemplateBottomNavbar;
					break;
				default:
					var template = TemplateTopNavbar;
					break;
			}

			return _.template(template, _.extend(data, {
				nav: this.options.nav,
				isAdmin: Registry.application.session.user.isAdmin()
			}));
		},

		onRender: function() {
			var self = this;

			function finish() {

				// perform callback
				//
				if (self.options.done) {
					self.options.done(self);
				}
			}
			
			// fetch the trial project
			//
			this.model.fetchCurrentTrial({

				// callbacks
				//
				success: function(data) {
					self.model = new Project(data);
					self.showNavbar(self.model);
					finish();
				},

				error: function() {
					self.showNavbar();
					finish();
				}
			});
		},

		showNavbar: function(trialProject) {
			this.navbar.show(
				new NavbarView({
					model: trialProject,
					nav: this.options.nav,
					showChangeIcons: this.options.showChangeIcons
				})
			);
		}
	});
});
