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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/info/sharing/tool-sharing.tpl',
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
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// show projects
			//
			this.collection.fetchByUser(application.session.user, {

				// callbacks
				//
				success: function() {

					// display approved projects list
					//
					self.showChildView('list', new SelectProjectsListView({
						collection: self.collection.getNonTrialProjects(),
						enabled: self.getSharingStatus() === 'protected'
					}));

					// fetch and select selected projects
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
								message: "Could not fetch tool sharing."
							});
						}
					});
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
			var self = this;

			if (this.getSharingStatus() === 'public') {

				// show confirmation
				//
				application.confirm({
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
					self.model.saveSharedProjects(self.getChildView('list').getSelected(), {
						
						// callbacks
						//
						success: function() {

							// show success notify message
							//
							application.notify({
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
							});
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not save tool's project sharing."
							});
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save tool."
					});
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
