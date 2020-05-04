/******************************************************************************\
|                                                                              |
|                      new-package-version-sharing-view.js                     |
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
	'text!templates/packages/info/versions/info/sharing/new-package-version-sharing.tpl',
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
			'click #prev': 'onClickPrev',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function( data ) {
			this.collection = new Projects();
		},

		//
		// methods
		//

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
						self.options.parent.save(function() {
							self.saveSharedProjects();
						});
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
				this.options.parent.save(function() {
					self.saveSharedProjects();
				});
			}
		},

		saveSharedProjects: function(done) {
			this.model.saveSharedProjects(this.getSharedProjects(), {
				
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

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				isAdmin: application.session.isAdmin(),
				package: this.options.package
			};
		},

		onRender: function() {
			var self = this;

			// show projects
			//
			this.collection.fetchByUser(this.options.user, {

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
					$(this.$el.find("input:checkbox")[i]).prop('checked', true);
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

			// update package version
			//
			this.model.set({
				'version_sharing_status': this.getSharingStatus()
			});

			// save package version
			//
			this.save();
		},

		onClickPrev: function() {

			// go to new package version build view
			//
			this.options.parent.showBuild();
		},

		onClickCancel: function() {

			// go to package view
			//
			application.navigate('#packages/' + this.model.get('package_uuid'));
		}
	});
});
