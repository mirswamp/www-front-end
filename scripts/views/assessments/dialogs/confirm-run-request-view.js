/******************************************************************************\
|                                                                              |
|                            confirm-run-request-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog that is used to confirm whether or not          |
|        to schedule an assessment run request.                                |
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
	'text!templates/assessments/dialogs/confirm-run-request.tpl',
	'registry'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click #run-now': 'onClickRunNow',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: this.options.title,
				packagePath: this.options.packagePath,
				config: Registry.application.config
			});
		},

		//
		// event handling methods
		//

		onClickRunNow: function() {
			if (this.options.accept) {
				var notifyWhenComplete = this.$el.find('#notify').is(':checked');
				this.options.accept(this.options.selectedAssessmentRuns, notifyWhenComplete);
			}
		},

		onClickCancel: function() {
			if (this.options.reject) {
				this.options.reject();
			}
		}
	});
});
