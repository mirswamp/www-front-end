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
	'text!templates/home.tpl',
	'models/projects/project',
	'views/base-view',
	'views/dashboard/dashboard-view',
], function($, _, Template, Project, BaseView, DashboardView) {
	return BaseView.extend({

		//
		// attributes
		//
		template: _.template(Template),

		regions: {
			content: '.content'
		},

		//
		// constructor
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
				this.showChildView('content', new DashboardView({
					model: trialProject
				}));
			}
		}
	});
});
