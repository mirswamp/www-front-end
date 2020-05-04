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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/versions/info/sharing/package-version-sharing.tpl',
	'collections/projects/projects',
	'views/base-view',
	'views/projects/select-list/select-projects-list-view'
], function($, _, Template, Projects, BaseView, SelectProjectsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#select-projects-list'
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
		// constructor
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
			if (application.session.isAdmin()) {
				return this.getSharingStatus() == 'protected';
			} else {
				return true;
			}
		},

		save: function() {
			var self = this;

			if (this.getSharingStatus() === 'public') {

				// show confirmation
				//
				application.confirm({
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
				});
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

		templateContext: function() {
			return {
				package: this.options.package,
				isAdmin: application.session.isAdmin(),
				showNavigation: this.options.showNavigation
			};
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

					// show error message
					//
					application.error({
						message: "Could not fetch user's projects."
					});
				}
			});
		},

		showSharedProjectsList: function() {

			// show select projects list
			//
			this.showChildView('list', new SelectProjectsListView({
				collection: this.collection,
				enabled: this.isProtected(),
				showTrialProjects: true
			}));

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
					self.getChildView('list').selectProjectsByUuids(data);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch package version sharing."
					});
				}
			});
		},

		//
		// event handling methods
		//

		onClickRadioSharing: function() {
			this.getChildView('list').setEnabled(
				this.isProtected()
			);
			if (!this.getChildView('list').isEnabled()) {
				this.getChildView('list').deselectAll();
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
			if (application.session.isAdmin()) {
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
					var selectedProjects = self.getChildView('list').getSelected();

					// save shared projects
					//
					self.model.saveSharedProjects(selectedProjects, {
						
						// callbacks
						//
						success: function() {

							// go to packages view
							//
							application.navigate('#packages/' + self.model.get('package_uuid'));
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not save package versions's project sharing."
							});
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save package version."
					});
				}
			});
		},

		onClickCancel: function() {

			// go to package view
			//
			application.navigate('#packages/' + this.model.get('package_uuid'));
		},

		onClickPrev: function() {

			// go to package version build view
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/build');
		},

		onClickStart: function() {

			// go to package version details view
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid'));
		}
	});
});
