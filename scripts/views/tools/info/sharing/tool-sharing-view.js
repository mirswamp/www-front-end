/******************************************************************************\
|                                                                              |
|                               tool-sharing-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a tool's shraring info.             |
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
	'text!templates/tools/info/sharing/tool-sharing.tpl',
	'registry',
	'collections/projects/projects',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/projects/select-list/select-projects-list-view'
], function($, _, Backbone, Marionette, Template, Registry, Projects, ConfirmView, NotifyView, ErrorView, SelectProjectsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			selectProjectsList: '#select-projects-list'
		},

		events: {
			'click input:radio[name=sharing]': 'onClickRadioSharing',
			'click input:checkbox': 'onClickCheckbox',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Projects()
		},

		getSharingStatus: function() {
			return this.$el.find('input:radio[name=sharing]:checked').val();
		},

		//
		// rendering methods
		//


		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {
			var self = this;

			// show projects
			//
			this.collection.fetchByUser(Registry.application.session.user, {

				// callbacks
				//
				success: function() {

					// display approved projects list
					//
					self.selectProjectsList.show(
						new SelectProjectsListView({
							collection: self.collection.getNonTrialProjects(),
							enabled: self.getSharingStatus() === 'protected'
						})
					);

					// fetch and select selected projects
					//
					self.model.fetchSharedProjects({

						// callbacks
						//
						success: function(data) {
							self.selectProjectsList.currentView.selectProjectsByUuids(data);
						},

						error: function() {

							// show error dialog
							//
							Registry.application.modal.show(
								new ErrorView({
									message: "Could not fetch tool sharing."
								})
							);				
						}
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch user's projects."
						})
					);
				}
			});
		},

		//
		// event handling methods
		//

		onClickRadioSharing: function() {
			this.selectProjectsList.currentView.setEnabled(
				this.getSharingStatus() === 'protected'
			);
			if (!this.selectProjectsList.currentView.isEnabled()) {
				this.selectProjectsList.currentView.deselectAll();
			}

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickCheckbox: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickSave: function() {
			var self = this;

			if (this.getSharingStatus() === 'public') {

				// show confirm changes dialog
				//
				Registry.application.modal.show(
					new ConfirmView({
						title: "Make Tool Public?",
						message: "By making this tool public every member of the SWAMP community will be able to access it. Do you wish to continue?",
						
						// callbacks
						//
						accept: function() {

							// disable save button
							//
							self.$el.find('#save').prop('disabled', true);

							// save sharing info
							//
							self.updateSharingStatus.call(self); 
						},

						reject: function() { 
							self.onClickCancel.call(self); 
						}
					})
				);
			} else {

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);

				// save sharing info
				//
				this.updateSharingStatus.call(this);
			}
		},

		updateSharingStatus: function() {
			var self = this;

			// update tool
			//
			this.model.set({
				'tool_sharing_status': this.getSharingStatus()
			});

			// save tool 
			//
			this.model.save(undefined, {

				// callbacks
				//
				success: function() {
					self.model.saveSharedProjects(self.selectProjectsList.currentView.getSelected(), {
						
						// callbacks
						//
						success: function() {

							// show success notification dialog
							//
							Registry.application.modal.show(
								new NotifyView({
									message: "Your changes to tool sharing been saved.",

									// callbacks
									//
									accept: function() {

										// go to tool view
										//
										Backbone.history.navigate('#tools/' + self.model.get('tool_uuid'), {
											trigger: true
										});
									}
								})
							);
						},

						error: function() {

							// show error dialog
							//
							Registry.application.modal.show(
								new ErrorView({
									message: "Could not save tool's project sharing."
								})
							);
						}
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save tool."
						})
					);
				}
			});
		},

		onClickCancel: function() {

			// go to tool view
			//
			Backbone.history.navigate('#tools/' + this.model.get('tool_uuid'), {
				trigger: true
			});
		}
	});
});
