/******************************************************************************\
|                                                                              |
|                        package-version-sharing-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|     This defines the view for showing a package version's sharing info.      |
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
	'text!templates/packages/info/versions/info/sharing/package-version-sharing.tpl',
	'registry',
	'collections/projects/projects',
	'views/dialogs/confirm-view',
	'views/dialogs/error-view',
	'views/projects/select-list/select-projects-list-view'
], function($, _, Backbone, Marionette, Template, Registry, Projects, ConfirmView, ErrorView, SelectProjectsListView) {
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
			'click #cancel': 'onClickCancel',
			'click #prev': 'onClickPrev',
			'click #start': 'onClickStart'
		},

		//
		// methods
		//

		initialize: function( data ) {
			this.collection = new Projects();
		},

		//
		// querying methods
		//

		getSharingStatus: function() {
			return this.$el.find("input:radio[name=sharing]:checked").val();
		},

		isProtected: function() {
			if (Registry.application.session.isAdmin()) {
				return this.getSharingStatus() == 'protected';
			} else {
				return true;
			}
		},

		save: function() {
			var self = this;

			if (this.getSharingStatus() === 'public') {

				// show confirm dialog
				//
				Registry.application.modal.show(
					new ConfirmView({
						title: "Make Package Public?",
						message: "By making this package version public every member of the SWAMP community will be able to access it. Do you wish to continue?",
						
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

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				package: this.options.package,
				isAdmin: Registry.application.session.isAdmin(),
				showNavigation: this.options.showNavigation
			}));
		},

		onRender: function() {
			var self = this;

			// fetch projects
			//
			this.collection.fetch({

				// callbacks
				//
				success: function() {
					self.showSharedProjectsList();
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

		showSharedProjectsList: function() {

			// show select projects list
			//
			this.selectProjectsList.show(
				new SelectProjectsListView({
					collection: new Projects(this.collection.filter(function() {
						return true;
					})),
					enabled: this.isProtected(),
					showTrialProjects: false
				})
			);

			// select projects list items that are shared
			//
			this.selectSharedProjects();
		},

		selectSharedProjects: function() {
			var self = this;

			// fetch and select shared projects
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
							message: "Could not fetch package version sharing."
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
				this.isProtected()
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
			this.save();
		},

		updateSharingStatus: function() {
			var self = this;

			// update version sharing status
			//
			if (Registry.application.session.isAdmin()) {
				this.model.set({
					'version_sharing_status': this.getSharingStatus()
				});
			}

			// save package 
			//
			this.model.save(undefined, {

				// callbacks
				//
				success: function() {
					var selectedProjects = self.selectProjectsList.currentView.getSelected();

					// save shared projects
					//
					self.model.saveSharedProjects(selectedProjects, {
						
						// callbacks
						//
						success: function() {

							// go to packages view
							//
							Backbone.history.navigate('#packages/' + self.model.get('package_uuid'), {
								trigger: true
							});
						},

						error: function() {

							// show error dialog
							//
							Registry.application.modal.show(
								new ErrorView({
									message: "Could not save package versions's project sharing."
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
							message: "Could not save package version."
						})
					);
				}
			});
		},

		onClickCancel: function() {

			// go to package view
			//
			Backbone.history.navigate('#packages/' + this.model.get('package_uuid'), {
				trigger: true
			});
		},

		onClickPrev: function() {

			// go to package version build view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/build', {
				trigger: true
			});
		},

		onClickStart: function() {

			// go to package version details view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid'), {
				trigger: true
			});
		}
	});
});
