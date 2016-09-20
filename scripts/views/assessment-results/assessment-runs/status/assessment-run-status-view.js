/******************************************************************************\
|                                                                              |
|                            assessment-run-status-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a single assessment run.            |
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
	'text!templates/assessment-results/assessment-runs/status/assessment-run-status.tpl',
	'registry',
	'views/assessment-results/assessment-runs/assessment-run-profile/assessment-run-profile-view'
], function($, _, Backbone, Marionette, Template, Registry, AssessmentRunProfileView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			assessmentRunProfile: '#assessment-run-profile'
		},

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				project: this.options.project,
				queryString: this.options.queryString
			}));
		},

		onRender: function() {
			this.assessmentRunProfile.show(
				new AssessmentRunProfileView({
					model: this.model
				})
			);
		},

		//
		// event handling methods
		//

		onClickOk: function() {
			var queryString = this.options.queryString;

			if (!Registry.application.session.user.isAdmin()) {

				// go to assessment results view
				//
				Backbone.history.navigate('#results' + (queryString && queryString != ''? '?' + queryString : ''), {
					trigger: true
				});
			} else {

				// go to results overview view
				//
				Backbone.history.navigate('#results/review' + (queryString && queryString != ''? '?' + queryString : ''), {
					trigger: true
				});		
			}
		}
	});
});