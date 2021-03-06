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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/add/add-new-project.tpl',
	'models/projects/project',
	'views/base-view',
	'views/projects/info/project-profile/project-profile-form-view'
], function($, _, Template, Project, BaseView, ProjectProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#project-profile'
		},

		events: {
			'input input, textarea': 'onChangeInput',
			'keyup input, textarea': 'onChangeInput',
			'click .alert .close': 'onClickAlertClose',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			this.model = new Project({
				'project_type_code': Project.prototype.projectTypeCodes[0],
				'status': 'pending',
				'exclude_public_tools_flag': 0
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;
			
			// display project profile form
			//
			this.showChildView('profile', new ProjectProfileFormView({
				model: this.model,

				// callbacks
				//
				onValidate: function(valid) {
					self.$el.find('#save').prop('disabled', !valid);
				}
			}));
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

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickSave: function() {

			// check validation
			//
			if (this.getChildView('profile').isValid()) {

				// update model from form
				//
				this.getChildView('profile').applyTo(this.model);

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);
			
				// save new project
				//
				this.model.save(undefined, {

					// callbacks
					//
					success: function(project) {

						// update user
						//
						application.session.user.set('num_projects', application.session.user.get('num_projects') + 1);

						// advance to project view
						//
						application.navigate('#projects/' + project.get('project_uid'));

					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not create new project."
						});
					}
				});

			} else {
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// return to projects view
			//
			application.navigate('#projects');
		}
	});
});
