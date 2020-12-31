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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'routers/base-router'
], function($, _, BaseRouter) {

	function parseQueryString(queryString) {

		// parse query string
		//
		var data = queryStringToData(queryString);

		// parse limit
		//
		if (data.limit) {
			if (data.limit != 'none') {
				data.limit = parseInt(data.limit);
			} else {
				data.limit = null;
			}
		}

		return data;
	}

	function fetchQueryStringData(data, done) {

		// fetch models
		//
		$.when(
			data.project? data.project.fetch() : true,
			data.projects? data.projects.fetch() : true
		).then(function() {

			// perform callback
			//
			done(data);	
		});
	}
	
	// create router
	//
	return BaseRouter.extend({

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
				'views/tools/tools-view'
			], function (ToolsView) {

				// show tools view
				//
				application.showContent({
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
							view.showChildView('content', new ToolsView({
								data: data				
							}), {
								nav: 'tools'
							});
						});
					}
				});
			});
		},

		showPublicTools: function() {
			require([
				'views/tools/public-tools-view'
			], function (PublicToolsView) {

				// show public tools view
				//
				application.showMain(new PublicToolsView(), {
					nav: 'resources'
				});
			});
		},

		showAddTool: function() {
			require([
				'views/tools/add/add-tool-view'
			], function (AddToolView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'tools', 

					// callbacks
					//
					done: function(view) {

						// show add tool view
						//
						view.showChildView('content', new AddToolView({
							user: application.session.user
						}));
					}
				});
			});
		},

		//
		// tool administration route handlers
		//

		showReviewTools: function(queryString) {
			require([
				'utilities/web/query-strings',
				'utilities/web/url-strings',
				'views/tools/review/review-tools-view',
			], function (QueryStrings, UrlStrings, ReviewToolsView) {

				// show content view
				//
				application.showContent({
					'nav1': 'home',
					'nav2': 'overview', 

					// callbacks
					//
					done: function(view) {

						// show review tools view
						//
						view.showChildView('content', new ReviewToolsView({
							data: parseQueryString(queryString)
						}));
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
				'models/tools/tool',
							'views/tools/tool-view'
			], function (Tool, ToolView) {
				Tool.fetch(toolUuid, function(tool) {

					// check if user is logged in
					//
					if (application.session.user) {

						// show content view
						//
						application.showContent({
							nav1: tool.isOwned()? 'home' : 'resources',
							nav2: tool.isOwned()? 'tools' : undefined, 

							// callbacks
							//	
							done: function(view) {

								// show tools
								//
								view.showChildView('content', new ToolView({
									model: tool,
									nav: options.nav,
									parent: view
								}));

								// perform callback
								//
								if (options.done) {
									options.done(view.getChildView('content'));
								}				
							}					
						});
					} else {

						// show single column tool view
						//
						application.showMain(new ToolView({
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
				'views/tools/info/details/tool-details-view'
			], function (ToolDetailsView) {

				// show tool view
				//
				self.showToolView(toolUuid, {
					nav: 'details',

					// callbacks
					//
					done: function(view) {

						// show tool details view
						//
						view.showChildView('info', new ToolDetailsView({
							model: view.model
						}));
					}
				});
			});
		},

		showToolSharing: function(toolUuid) {
			var self = this;
			require([
				'views/tools/info/sharing/tool-sharing-view'
			], function (ToolSharingView) {

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
				'views/tools/info/details/edit-tool-details-view',
			], function (EditToolDetailsView) {

				// show tool view
				//
				self.showToolView(toolUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show edit tool details view
						//
						view.options.parent.showChildView('content', new EditToolDetailsView({
							model: view.model
						}));
					}
				});
			});
		},

		showToolPolicy: function(toolUuid) {
			var self = this;
			require([
				'views/policies/policy-view'
			], function (PolicyView) {

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
								view.options.parent.showChildView('content', new PolicyView({
									policyTitle: '<span class="name">' + view.model.get('name') + '</span>' + " Tool Policy",
									policyText: data
								}));
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not fetch tool policy."
								});
							}
						});
					}
				});
			});
		},

		showAddToolVersion: function(toolUuid) {
			require([
				'views/tools/versions/add/add-tool-version-view'
			], function (AddToolVersionView) {

				// show tool view
				//
				self.showToolView(toolUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show add tool version view
						//
						view.options.parent.showChildView('content', new AddToolVersionView({
							model: view.model
						}));
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
				'models/tools/tool',
				'models/tools/tool-version',
							'views/tools/info/versions/tool-version/tool-version-view'
			], function (Tool, ToolVersion, ToolVersionView) {
				ToolVersion.fetch(toolVersionUuid, function(toolVersion) {
					Tool.fetch(toolVersion.get('tool_uuid'), function(tool) {

						// check if user is logged in
						//
						if (application.session.user) {

							// show content view
							//
							application.showContent({
								nav1: tool.isOwned()? 'home' : 'resources',
								nav2: tool.isOwned()? 'tools' : undefined, 

								// callbacks
								//	
								done: function(view) {

									// show tool version
									//
									view.showChildView('content', new ToolVersionView({
										model: toolVersion,
										tool: tool,
										parent: view
									}));

									// perform callback
									//
									if (options && options.done) {
										options.done(view.getChildView('content'));
									}				
								}					
							});
						} else {

							// show single column package version view
							//
							application.showMain(new ToolVersionView({
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
				'views/tools/info/versions/tool-version/edit-tool-version-view'
			], function (EditToolVersionView) {

				// show tool version view
				//
				self.showToolVersion(toolVersionUuid, {
					nav: 'details', 

					// callbacks
					//
					done: function(view) {

						// show edit tool version view
						//
						view.options.parent.showChildView('content', new EditToolVersionView({
							model: view.model,
							tool: view.options.tool
						}));
					}
				});
			});
		}
	});
});