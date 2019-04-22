/******************************************************************************\
|                                                                              |
|                                    home-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the home view that the user sees upon login.             |
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
	'text!templates/home.tpl',
	'registry',
	'models/projects/project',
	'views/dialogs/error-view',
	'views/dashboard/dashboard-view',
], function($, _, Backbone, Marionette, Template, Registry, Project, ErrorView, DashboardView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//
		template: _.template(Template),

		regions: {
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

		onRender: function() {
			var self = this;
			this.model.fetchCurrentTrial({

				// callbacks
				//
				success: function(data) {
					self.showDashboard(new Project(data));
				},

				error: function() {
					self.showDashboard();
				}
			});
		},

		showDashboard: function(trialProject) {
			if (this.options.nav === 'home') {
				if (this.content) {
					this.content.show(
						new DashboardView({
							model: trialProject
						})
					);
				}
			}	
		}
	});
});
