/******************************************************************************\
|                                                                              |
|                               tool-details-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a tool's profile info.              |
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
	'text!templates/tools/info/details/tool-details.tpl',
	'collections/tools/tool-versions',
	'views/base-view',
	'views/tools/info/details/tool-profile/tool-profile-view',
	'views/tools/info/versions/tool-versions-list/tool-versions-list-view'
], function($, _, Template, ToolVersions, BaseView, ToolProfileView, ToolVersionsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#tool-profile',
			list: '#tool-versions-list'
		},

		events: {
			'click #add-new-version': 'onClickAddNewVersion',
			'click #edit-tool': 'onClickEditTool',
			'click #delete-tool': 'onClickDeleteTool',
			'click #show-policy': 'onClickShowPolicy'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new ToolVersions();
		},

		//
		// ajax methods
		//

		fetchToolVersions: function(done) {
			var self = this;
			this.collection.fetchByTool(this.model, {

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch tool versions."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				isOwned: this.model.isOwned(),
				isAdmin: application.session.isAdmin(),
				showPolicy: this.model.has('policy_code')
			};
		},

		onRender: function() {
			var self = this;
			
			// display project profile view
			//
			this.showChildView('profile', new ToolProfileView({
				model: this.model
			}));

			// fetch and show tool versions
			//
			this.fetchToolVersions(function() {
				self.showToolVersions();
			});
		},

		showToolVersions: function() {

			// show tool versions list view
			//
			this.showChildView('list', new ToolVersionsListView({
				model: this.model,
				collection: this.collection,
				showDelete: false
			}));
		},

		//
		// event handling methods
		//

		onClickAddNewVersion: function() {

			// go to add tool version view
			//
			/*
			application.navigate('#tools/' + this.model.get('tool_uuid') + '/versions/add');
			*/
			application.notify({
				message: "This feature is no longer supported."
			});
		},

		onClickEditTool: function() {

			// go to edit tool view
			//
			application.navigate('#tools/' + this.model.get('tool_uuid') + '/edit');
		},

		onClickDeleteTool: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Tool",
				message: "Are you sure that you would like to delete tool " + self.model.get('name') + "? " +
					"When you delete a tool, all of the project data will continue to be retained.",

				// callbacks
				//
				accept: function() {

					// delete user
					//
					self.model.destroy({

						// callbacks
						//
						success: function() {

							// show success notify message
							//
							application.notify({
								title: "Tool Deleted",
								message: "This tool has been successfuly deleted.",

								// callbacks
								//
								accept: function() {

									// return to main view
									//
									application.navigate('#home');
								}
							});
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this tool."
							});
						}
					});
				}
			});
		},

		onClickShowPolicy: function() {

			// go to tool policy view
			//
			application.navigate('#tools/' + this.model.get('tool_uuid') + '/policy');		
		}
	});
});
