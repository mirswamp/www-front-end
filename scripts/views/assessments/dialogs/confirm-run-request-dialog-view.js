/******************************************************************************\
|                                                                              |
|                      confirm-run-request-dialog-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is used to confirm whether or not      |
|        to schedule an assessment run request.                                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/assessments/dialogs/confirm-run-request-dialog.tpl',
	'views/dialogs/dialog-view',
], function($, _, Template, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #run-now': 'onClickRunNow',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.options.title,
				packagePath: this.options.packagePath
			};
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
