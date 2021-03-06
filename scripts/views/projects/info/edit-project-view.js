/******************************************************************************\
|                                                                              |
|                               edit-project-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a project's profile info.           |
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
	'text!templates/projects/info/edit-project.tpl',
	'models/viewers/viewer',
	'views/base-view',
	'views/projects/info/project-profile/project-profile-form-view',
	'utilities/time/date-format',
], function($, _, Template, Viewer, BaseView, ProjectProfileFormView, DateFormat) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#project-profile-form'
		},

		events: {
			'input input, textarea': 'onChangeInput',
			'keyup input, textarea': 'onChangeInput',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// constuctor
		//

		initialize: function() {
			this.viewer = new Viewer();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				url: this.model.getAppUrl()
			};
		},

		onRender: function() {

			// display project profile form view
			//
			this.showChildView('form', new ProjectProfileFormView({
				model: this.model
			}));
		},

		//
		// event handling methods
		//

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickSave: function() {
			var self = this;

			if (this.getChildView('form').isValid()) {

				// update model
				//
				this.getChildView('form').applyTo(this.model);

				// ensure timezone isn't affected
				//
				this.model.set({
					accept_date: this.model.get('accept_date') ? dateFormat(this.model.get('accept_date'), 'yyyy-mm-dd HH:MM:ss') : this.model.get('accept_date'),
					create_date: this.model.get('create_date') ? dateFormat(this.model.get('create_date'), 'yyyy-mm-dd HH:MM:ss') : this.model.get('create_date'),
					denial_date: this.model.get('denial_date') ? dateFormat(this.model.get('denial_date'), 'yyyy-mm-dd HH:MM:ss') : this.model.get('denial_date'),
					deactivation_date: this.model.get('deactivation_date') ? dateFormat(this.model.get('deactivation_date'), 'yyyy-mm-dd HH:MM:ss') : this.model.get('deactivation_date')
				});

				// update project default viewer relationship
				//
				/*
				var updated = this.viewer.updateProjectDefaultViewer({
					project_uid: this.model.get('project_uid'),
					viewer_uuid: this.model.get('viewer_uuid')
				});
				*/

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);

				// save changes
				//
				this.model.save(undefined, {

					// callbacks
					//
					success: function() {

						// return to project view
						//
						application.navigate('#projects/' + self.model.get('project_uid'));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not save project changes."
						});
					}
				});
			} // if isValid
		},

		onClickCancel: function() {
			application.navigate('#projects/' + this.model.get('project_uid'));
		}
	});
});
