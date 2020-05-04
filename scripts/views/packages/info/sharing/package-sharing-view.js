/******************************************************************************\
|                                                                              |
|                             package-sharing-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package's sharing info.           |
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
	'text!templates/packages/info/sharing/package-sharing.tpl',
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
			'click #apply-to-all': 'onClickApplyToAll',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Projects();
		},

		//
		// querying methods
		//

		getSharingStatus: function() {
			return this.$el.find('input:radio[name=sharing]:checked').val();
		},

		//
		// setting methods
		//

		updateSharingStatus: function() {
			var self = this;

			// update package
			//
			this.model.set({
				'package_sharing_status': this.getSharingStatus()
			});

			// save package 
			//
			this.model.save(undefined, {

				// callbacks
				//
				success: function() {
					self.model.saveSharedProjects(self.getChildView('list').getSelected(), {
						
						// callbacks
						//
						success: function() {

							// show success notify view
							//
							application.notify({
								message: "Your changes to package sharing been saved.",

								// callbacks
								//
								accept: function() {

									// go to package view
									//
									application.navigate('#packages/' + self.model.get('package_uuid'));
								}
							});
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not save package's project sharing."
							});
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save package."
					});
				}
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// show projects
			//
			this.collection.fetch({

				// callbacks
				//
				success: function() {

					// display approved projects list
					//
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
				collection: new Projects(this.collection.filter(function() {
					return true;
				})),
				enabled: this.getSharingStatus() === 'protected'
			}));

			// select shared project list items
			//
			this.selectSharedProjects();
		},

		selectSharedProjects: function() {
			var self = this;

			// fetch and select selected projects
			//
			this.model.fetchSharedProjects({

				// callbacks
				//
				success: function(data) {
					self.getChildView('list').selectProjectsByUuids(data);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch package sharing."
					});
				}
			});
		},

		//
		// event handling methods
		//

		onClickRadioSharing: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);

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

		onClickApplyToAll: function(){
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Apply Default Sharing to All Versions?",
				message: "This will apply the currently saved default sharing permissions specified for this package to be used for all versions of this package.  Do you wish to proceed?",
				
				// callbacks
				//
				accept: function() {
					self.model.applySharing({
						
						// callbacks
						//
						success: function() {

							// show success notify view
							//
							application.notify({
								message: "Your default sharing settings have been applied to all versions of this package.",

								// callbacks
								//
								accept: function() {

									// go to package view
									//
									application.navigate('#packages/' + self.model.get('package_uuid'));
								}
							});
						},
						
						error: function() {

							// show error message
							//
							application.error({
								message: "Could not apply the default sharing settings to all packages."
							});
						}
					});	
				},
				
				reject: function() {
				}
			});
		},

		onClickCancel: function() {

			// go to package view
			//
			application.navigate('#packages/' + this.model.get('package_uuid'));
		}
	});
});
