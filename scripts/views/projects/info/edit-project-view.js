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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/projects/info/edit-project.tpl',
	'registry',
	'utilities/time/date-format',
	'views/dialogs/error-view',
	'views/projects/info/project-profile/project-profile-form-view',
	'models/viewers/viewer'
], function($, _, Backbone, Marionette, Template, Registry, DateFormat, ErrorView, ProjectProfileFormView, Viewer) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			projectProfileForm: '#project-profile-form'
		},

		events: {
			'change input, textarea': 'onChangeInput',
			'keyup input, textarea': 'onChangeInput',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		initialize: function(){
			this.viewer = new Viewer();
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {

			// display project profile form view
			//
			this.projectProfileForm.show(
				new ProjectProfileFormView({
					model: this.model
				})
			);
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

			if (this.projectProfileForm.currentView.isValid()) {

				// update model
				//
				this.projectProfileForm.currentView.update(this.model);

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
						Backbone.history.navigate('#projects/' + self.model.get('project_uid'), {
							trigger: true
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not save project changes."
							})
						);
					}
				});
			} // if isValid
		},

		onClickCancel: function() {
			Backbone.history.navigate('#projects/' + this.model.get('project_uid'), {
				trigger: true
			});
		}
	});
});
