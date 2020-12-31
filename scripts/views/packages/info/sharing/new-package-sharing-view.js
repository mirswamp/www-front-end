/******************************************************************************\
|                                                                              |
|                            new-package-sharing-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a new package's sharing info.       |
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
	'text!templates/packages/info/sharing/new-package-sharing.tpl',
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
			'click #save': 'onClickSave',
			'click #prev': 'onClickPrev',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Projects();
		},

		//
		// methods
		//

		saveSharedProjects: function(done) {
			this.options.packageVersion.saveSharedProjects(this.getSharedProjects(), {
				
				// callbacks
				//
				success: function() {

					// perform callback
					//
					if (done) {
						done();
					}
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

		savePackageAndVersionSharing: function(done) {
			var self = this;

			// update package version
			//
			this.options.packageVersion.set({
				'version_sharing_status': this.getSharingStatus()
			});
				
			// save package and version
			//
			this.options.parent.save(function() {

				// save package version sharing
				//
				self.saveSharedProjects(done);
			});		
		},

		//
		// querying methods
		//

		getSharingStatus: function() {
			if (application.session.isAdmin()) {
				return this.$el.find('input:radio[name=sharing]:checked').val();
			} else {
				return 'protected';
			}
		},

		getSharedProjects: function() {
			var sharedProjects = this.getChildView('list').getSelected();

			// make sure that 'My Project' is included
			//
			var trialProjects = this.collection.getTrialProjects();
			if (trialProjects.length > 0) {
				var trialProject = trialProjects.at(0);
				if (!sharedProjects.contains(trialProject)) {
					sharedProjects.add(trialProject);
				}		
			}

			return sharedProjects;
		},

		getSelectedProjectUuids: function() {
			return [getQueryStringValue(getQueryString(), 'project')];
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				isAdmin: application.session.isAdmin(),
				version_sharing_status: this.options.packageVersion.get('package_sharing_status')
			};
		},

		onRender: function() {
			var self = this;

			// show projects
			//
			this.collection.fetchByUser(application.session.user, {

				// callbacks
				//
				success: function() {
					self.showSelectProjectsList();
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

		showSelectProjectsList: function() {

			// show select projects list
			//
			this.showChildView('list', new SelectProjectsListView({
				collection: this.collection,
				enabled: this.getSharingStatus() === 'protected',
				selectedProjectsUuids: this.getSelectedProjectUuids(),
				showTrialProjects: true
			}));

			// select shared project list items
			//
			this.selectSharedProjects();
		},

		//
		// form methods
		//

		selectSharedProjects: function() {

			// set default sharing status
			//
			this.setSharingStatus('protected');
			this.getChildView('list').enable();

			// select My Project by default
			//
			/*
			for (var i = 0; i < this.collection.length; i++) {
				var project = this.collection.at(i);
				if (project.isTrialProject()) {
					$(this.$el.find('input:checkbox')[i]).prop('checked', true);
					break;
				}
			}
			*/
		},

		setSharingStatus: function(sharing) {
			return this.$el.find('input:radio[value="' + sharing + '"]').attr('checked', true);
		},

		//
		// event handling methods
		//

		onClickRadioSharing: function() {
			this.getChildView('list').setEnabled(
				this.getSharingStatus() === 'protected'
			);
			if (!this.getChildView('list').isEnabled()) {
				this.getChildView('list').deselectAll();
			}
		},

		onClickSave: function() {
			var self = this;

			if (this.getSharingStatus() === 'public') {

				// show confirmation
				//
				application.confirm({
					title: "Make Package Public?",
					message: "By making this package public every member of the SWAMP community will be able to access it. Do you wish to continue?",
					
					// callbacks
					//
					accept: function() {

						// disable save button
						//
						self.$el.find('#save').prop('disabled', true);

						// save sharing info
						//
						self.savePackageAndVersionSharing();
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
				this.savePackageAndVersionSharing();
			}
		},

		onClickPrev: function() {
			this.options.parent.showBuild();
		},

		onClickCancel: function() {

			// go to packages view
			//
			application.navigate('#packages');
		}
	});
});
