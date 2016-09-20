/******************************************************************************\
|                                                                              |
|                               add-new-project-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view used to add new projects.                       |
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
	'text!templates/projects/add/add-new-project.tpl',
	'registry',
	'models/projects/project',
	'views/dialogs/error-view',
	'views/projects/info/project-profile/project-profile-form-view'
], function($, _, Backbone, Marionette, Template, Registry, Project, ErrorView, ProjectProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			projectProfile: '#project-profile'
		},

		events: {
			'change input, textarea': 'onChangeInput',
			'keyup input, textarea': 'onChangeInput',
			'click .alert .close': 'onClickAlertClose',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {
			var user = Registry.application.session.user;
			this.model = new Project({
				'project_owner_uid': user.get('user_uid'),
				'project_type_code': Project.prototype.projectTypeCodes[0],
				'status': 'pending',
				'exclude_public_tools_flag': 0
			});
		},

		onRender: function() {

			// display project profile form
			//
			this.projectProfile.show(
				new ProjectProfileFormView({
					model: this.model
				})
			);
		},

		showWarning: function() {
			this.$el.find('.alert').show();
		},

		hideWarning: function() {
			this.$el.find('.alert').hide();
		},

		//
		// event handling methods
		//

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickSave: function() {

			// check validation
			//
			if (this.projectProfile.currentView.isValid()) {

				// update model from form
				//
				this.projectProfile.currentView.update(this.model);

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);
			
				// save new project
				//
				this.model.save(undefined, {

					// callbacks
					//
					success: function( project ) {

						// advance to project submitted project
						//
						Backbone.history.navigate('#projects/' + project.get('project_uid'), {
							trigger: true
						});

					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not create new project."
							})
						);
					}

				});

			} else {
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// return to projects view
			//
			Backbone.history.navigate('#projects', {
				trigger: true
			});
		}
	});
});
