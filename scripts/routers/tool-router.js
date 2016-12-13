/******************************************************************************\
|                                                                              |
|                                  tool-router.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for tool routes.             |
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
	'backbone'
], function($, _, Backbone) {

	function parseQueryString(queryString) {

		// parse query string
		//
		var data = queryStringToData(queryString);

		// parse limit
		//
		if (data['limit']) {
			if (data['limit'] != 'none') {
				data['limit'] = parseInt(data['limit']);
			} else {
				data['limit'] = null;
			}
		}

		return data;
	}

	function fetchQueryStringData(data, done) {

		// fetch models
		//
		$.when(
			data['project']? data['project'].fetch() : true,
			data['projects']? data['projects'].fetch() : true
		).then(function() {

			// perform callback
			//
			done(data);	
		});
	}
	
	// create router
	//
	return Backbone.Router.extend({

		//
		// route definitions
		//

		routes: {

			// tools routes
			//
			'tools(?*query_string)': 'showTools',
			'tools/public': 'showPublicTools',
			'tools/add': 'showAddTool',

			// tool administration routes
			//
			'tools/review(?*query_string)': 'showReviewTools',

			// tool routes
			//
			'tools/:tool_uuid': 'showTool',
			'tools/:tool_uuid/sharing': 'showToolSharing',
			'tools/:tool_uuid/edit': 'showEditTool',
			'tools/:tool_uuid/policy': 'showToolPolicy',
			'tools/:tool_uuid/versions/add': 'showAddToolVersion',

			// tool version routes
			//
			'tools/versions/:tool_version_uuid': 'showToolVersion',
			'tools/versions/:tool_version_uuid/edit': 'showEditToolVersion'	
		},

		//
		// tools route handlers
		//

		showTools: function(queryString) {
			require([
				'registry',
				'views/tools/tools-view'
			], function (Registry, ToolsView) {

				// show tools view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'tools', 

					// callbacks
					//
					done: function(view) {

						// parse and fetch query string data
						//
						fetchQueryStringData(parseQueryString(queryString, view.model), function(data) {
							
							// show packages view
							//
							view.content.show(
								new ToolsView({
									data: data				
								}), {
									nav: 'tools'
								}
							)				
						});
					}
				});
			});
		},

		showPublicTools: function() {
			require([
				'registry',
				'views/tools/public-tools-view'
			], function (Registry, PublicToolsView) {

				// show public tools view
				//
				Registry.application.showMain(
					new PublicToolsView(), {
						nav: 'resources'
					}
				);
			});
		},

		showAddTool: function() {
			require([
				'registry',
				'views/tools/add/add-tool-view'
			], function (Registry, AddToolView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'tools', 

					// callbacks
					//
					done: function(view) {

						// show add tool view
						//
						view.content.show(
							new AddToolView({
								user: Registry.application.session.user
							})
						);
					}
				});
			});
		},

		//
		// tool administration route handlers
		//

		showReviewTools: function(queryString) {
			require([
				'registry',
				'utilities/browser/query-strings',
				'utilities/browser/url-strings',
				'views/tools/review/review-tools-view',
			], function (Registry, QueryStrings, UrlStrings, ReviewToolsView) {

				// show content view
				//
				Registry.application.showContent({
					'nav1': 'home',
					'nav2': 'overview', 

					// callbacks
					//
					done: function(view) {

						// show review tools view
						//
						view.content.show(
							new ReviewToolsView({
								data: parseQueryString(queryString)
							})
						);
					}
				});
			});
		},

		//
		// tool route helper functions
		//

		showToolView: function(toolUuid, options) {
			var self = this;
			require([
				'registry',
				'models/tools/tool',
				'views/dialogs/error-view',
				'views/tools/tool-view'
			], function (Registry, Tool, ErrorView, ToolView) {
				Tool.fetch(toolUuid, function(tool) {

					// check if user is logged in
					//
					if (Registry.application.session.user) {

						// show content view
						//
						Registry.application.showContent({
							nav1: tool.isOwned()? 'home' : 'resources',
							nav2: tool.isOwned()? 'tools' : undefined, 

							// callbacks
							//	
							done: function(view) {
								view.content.show(
									new ToolView({
										model: tool,
										nav: options.nav,
										parent: view
									})
								);

								if (options.done) {
									options.done(view.content.currentView);
								}				
							}					
						});
					} else {

						// show single column tool view
						//
						Registry.application.showMain(
							new ToolView({
								model: package,
								nav: options.nav
							}), {
							done: options.done
						});
					}
				});
			});
		},

		//
		// tool route handlers
		//

		showTool: function(toolUuid) {
			var self = this;
			require([
				'registry',
				'views/tools/info/details/tool-details-view'
			], function (Registry, ToolDetailsView) {

				// show tool view
				//
				self.showToolView(toolUuid, {
					nav: 'details',

					// callbacks
					//
					done: function(view) {

						// show tool details view
						//
						view.toolInfo.show(
							new ToolDetailsView({
								model: view.model
							})
						);
					}
				});
			});
		},

		showToolSharing: function(toolUuid) {
			var self = this;
			require([
				'registry',
				'views/tools/info/sharing/tool-sharing-view'
			], function (Registry, ToolSharingView) {

				// show tool view
				//
				self.showToolView(toolUuid, {
					nav: 'sharing',

					// callbacks
					//
					done: function(view) {

						// show tool sharing view
						//
						view.toolInfo.show(
							new ToolSharingView({
								model: view.model
							})
						);
					}
				});
			});
		},

		showEditTool: function(toolUuid) {
			var self = this;
			require([
				'registry',
				'views/tools/info/details/edit-tool-details-view',
			], function (Registry, EditToolDetailsView) {

				// show tool view
				//
				self.showToolView(toolUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show edit tool details view
						//
						view.options.parent.content.show(
							new EditToolDetailsView({
								model: view.model
							})
						);
					}
				});
			});
		},

		showToolPolicy: function(toolUuid) {
			var self = this;
			require([
				'registry',
				'views/policies/policy-view'
			], function (Registry, PolicyView) {

				// show tool view
				//
				self.showToolView(toolUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {
						view.model.fetchPolicy({

							// callbacks
							//
							success: function(data) {

								// show policy view
								//
								view.options.parent.content.show(
									new PolicyView({
										policyTitle: '<span class="name">' + view.model.get('name') + '</span>' + " Tool Policy",
										policyText: data
									})
								);
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not fetch tool policy."
									})
								);
							}
						});
					}
				});
			});
		},

		showAddToolVersion: function(toolUuid) {
			require([
				'registry',
				'views/tools/versions/add/add-tool-version-view'
			], function (Registry, AddToolVersionView) {

				// show tool view
				//
				self.showToolView(toolUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show add tool version view
						//
						view.options.parent.content.show(
							new AddToolVersionView({
								model: view.model
							})
						);
					}
				});
			});
		},

		//
		// tool version route handlers
		//

		showToolVersion: function(toolVersionUuid, options) {
			var self = this;
			require([
				'registry',
				'models/tools/tool',
				'models/tools/tool-version',
				'views/dialogs/error-view',
				'views/tools/info/versions/tool-version/tool-version-view'
			], function (Registry, Tool, ToolVersion, ErrorView, ToolVersionView) {
				ToolVersion.fetch(toolVersionUuid, function(toolVersion) {
					Tool.fetch(toolVersion.get('tool_uuid'), function(tool) {

						// check if user is logged in
						//
						if (Registry.application.session.user) {

							// show content view
							//
							Registry.application.showContent({
								nav1: tool.isOwned()? 'home' : 'resources',
								nav2: tool.isOwned()? 'tools' : undefined, 

								// callbacks
								//	
								done: function(view) {
									view.content.show(
										new ToolVersionView({
											model: toolVersion,
											tool: tool,
											parent: view
										})
									);

									if (options && options.done) {
										options.done(view.content.currentView);
									}				
								}					
							});
						} else {

							// show single column package version view
							//
							Registry.application.showMain(
								new ToolVersionView({
									model: toolVersion,
									tool: tool
								}), {
								done: options.done
							});
						}
					});
				});
			});
		},

		showEditToolVersion: function(toolVersionUuid) {
			var self = this;
			require([
				'registry',
				'views/tools/info/versions/tool-version/edit-tool-version-view'
			], function (Registry, EditToolVersionView) {

				// show tool version view
				//
				self.showToolVersion(toolVersionUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show edit tool version view
						//
						view.options.parent.content.show(
							new EditToolVersionView({
								model: view.model,
								tool: view.options.tool
							})
						);
					}
				});
			});
		}
	});
});