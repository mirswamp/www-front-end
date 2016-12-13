/******************************************************************************\
|                                                                              |
|                                application.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level view of the application.                   |
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
	'cookie',
	'config',
	'marionette',
	'text!templates/layout/application.tpl',
	'registry',
	'utilities/scripting/string-utils',
	'utilities/scripting/array-utils',
	'utilities/browser/html-utils',
	'utilities/browser/browser-support',
	'routers/main-router',
	'routers/package-router',
	'routers/tool-router',
	'routers/platform-router',
	'routers/project-router',
	'routers/assessment-router',
	'routers/results-router',
	'routers/run-requests-router',
	'routers/api-router',
	'models/users/session',
	'views/layout/page-view',
	'views/dialogs/modal-region',
	'views/dialogs/error-view',
], function($, _, Backbone, Cookie, Config, Marionette, Template, Registry, StringUtils, ArrayUtils, HTMLUtils, BrowserSupport, MainRouter, PackageRouter, ToolRouter, PlatformRouter, ProjectRouter, AssessmentRouter, ResultsRouter, RunRequestsRouter, ApiRouter, Session, PageView, ModalRegion, ErrorView) {
	return Marionette.Application.extend({

		// attributes
		//
		template: _.template(Template),

		regions: {
			main: "#main",
			modal: ModalRegion
		},

		//
		// constructor
		//

		initialize: function(options) {
			var self = this;

			// set optional parameter defaults
			//
			if (!options) {
				options = {};
			}
			if (options.showNumbering == undefined) {
				options.showNumbering = false;
			}
			if (options.showGrouping == undefined) {
				options.showGrouping = true;
			}
			if (options.autoRefresh == undefined) {
				options.autoRefresh = true;
			}

			// set attributes
			//	
			this.options = options;

			// load options from cookie
			//
			this.loadOptions();

			// create new session
			//
			this.session = new Session();

			// in the event of a javascript error, reset the pending ajax spinner
			//
			$(window).error(function(){
				if ($.active > 0) {
					$.active = 0;
					$.event.trigger('ajaxStop');
				}
			});

			// ensure all cookie information is forwarded by default and watch for expired or fraudluent sessions
			//
			$.ajaxSetup({
				xhrFields: {
					withCredentials: true
				}
			});

			// log the user out if their session is found to be invalid
			//
			$(document).ajaxError(function(event, jqXHR){
				if( jqXHR.responseText === 'SESSION_INVALID' ){
					self.modal.show( 
						new ErrorView({
							message: "Sorry, your session has expired, please log in again to continue using the SWAMP.",
							
							// callbacks
							//
							accept: function() {
								Registry.application.session.logout({

									// callbacks
									// 
									success: function() {

										// go to welcome view
										//
										Backbone.history.navigate("#", {
											trigger: true
										});
									}
								});
							}
						})
					);
				}
			});

			// set ajax calls to display wait cursor while pending
			//
			this.resources = 0;
			$(document).ajaxStart(function() {
				if (self.resources == 0) {

					// show wait cursor
					//
					$('html').attr('style', 'cursor: wait !important; pointer-events: none');
					//$(document).trigger($.Event('mousemove'));
				}
				self.resources++;
			}).ajaxStop(function() {
				self.resources--;
				if (self.resources == 0) {

					// return to default cursor
					//
					$('html').attr('style', 'cursor: default');
					//$(document).trigger($.Event('mousemove');
				}
			});

			// store handle to application in registry
			//
			Registry.addKey("application", this);

			// set resize handler to look for changes in number of columns
			//
			this.onResizeHandler = $(window).resize(function() {
				if (self.numColumns != undefined && self.numColumns != self.getNumColumns()) {

					// redraw
					//
					Backbone.history.stop();
					Backbone.history.start();
				};				
			});

			// create regions
			//
			this.addRegions(this.regions);
		},

		createRouters: function() {
			this.mainRouter = new MainRouter();
			this.packageRouter = new PackageRouter();
			this.toolRouter = new ToolRouter();
			this.platformRouter = new PlatformRouter();
			this.projectRouter = new ProjectRouter();
			this.assessmentRouter = new AssessmentRouter();
			this.resultsRouter = new ResultsRouter();
			this.runRequestsRouter = new RunRequestsRouter();
			this.apiRouter = new ApiRouter();

			this.routers = [
				this.mainRouter,
				this.packageRouter,
				this.toolRouter,
				this.platformRouter,
				this.projectRouter,
				this.assessmentRouter,
				this.resultsRouter,
				this.runRequestsRouter,
				this.apiRouter
			];
		},

		startRouters: function() {
			this.createRouters();

			// after any route change, clear modal dialogs
			//
			for (var i = 0; i < this.routers.length; i++) {
				this.routers[i].on("route", function(route, params) {
					if (self.modal.currentView) {
						self.modal.currentView.destroy();
					}
				});
			}

			Backbone.history.start();
		},

		checkBrowserSupport: function() {
			var browserList = "<ul>" + 
				"<li>Chrome 7.0 or later</li>" + 
				"<li>Firefox 4.0 or later</li>" + 
				"<li>IE 10.0 or later</li>" +
				"<li>Safari 5.0 or later</li>" +
				"<li>Opera 12.0 or later</li>" +
				"</ul>";
			var errorView;
			
			if (!browserSupportsCors()) {
				this.modal.show(
					new ErrorView({
						message: "Sorry, your web browser does not support cross origin resources sharing.  You will need to upgrade your web browser to a newer version in order to use this application." +
							"<p>We suggest the following: " + browserList + "</p>"
					})
				);
			} else if (!browserSupportsHTTPRequestUploads()) {
				this.modal.show(
					new ErrorView({
						message: "Sorry, your web browser does not support the XMLHttpRequest2 object which is needed for uploading files.  You will need to upgrade your web browser to a newer version in order to upload files using this application." +
							"<p>We suggest the following: " + browserList + "</p>"
					})
				);				
			} else if (!browserSupportsFormData()) {
				this.modal.show(
					new ErrorView({
						message: "Sorry, your web browser does not support the FormData object which is needed for uploading files.  You will need to upgrade your web browser to a newer version in order to upload files using this application." +
							"<p>We suggest the following: " + browserList + "</p>"
					})
				);				
			}
		},

		//
		// options / cookie methods
		//

		saveOptions: function() {

			// save options for later use
			//
			$.cookie('swamp', JSON.stringify({
				layout: this.options.layout,
				showNumbering: this.options.showNumbering,
				showGrouping: this.options.showGrouping,
				autoRefresh: this.options.autoRefresh,
				authProvider: this.options.authProvider
			}), { 
				expires: 7, 
				domain: Config.cookie.domain, 
				path: Config.cookie.path, 
				secure: Config.cookie.secure 
			});
		},

		loadOptions: function() {

			// load options from cookie
			//
			var cookie = $.cookie('swamp');
			if (cookie) {
				var options = JSON.parse(cookie);
				this.options = _.extend(this.options, options);
			}
		},

		//
		// querying methods
		//

		getURL: function() {
			var protocol = window.location.protocol;
			var hostname = window.location.host;
			var pathname = window.location.pathname;
			return protocol + '//' + hostname + pathname;
		},

		isMobile: function() {
			return false;
			/*
			return (
				navigator.userAgent.match(/Android/i) ||
				navigator.userAgent.match(/webOS/i) ||
				navigator.userAgent.match(/iPhone/i) ||
				navigator.userAgent.match(/iPad/i) ||
				navigator.userAgent.match(/iPod/i) ||
				navigator.userAgent.match(/BlackBerry/i) ||
				navigator.userAgent.match(/Windows Phone/i)
			);
			*/
		},

		//
		// layout methods
		//

		setLayout: function(layout) {
			this.options.layout = layout;
			this.saveOptions();
		},

		getNavbarOrientation: function() {
			if (this.isMobile()) {
				return 'bottom';
			} else {
				switch (this.options.layout) {
					case 'one-column-top-navbar':
						return 'top';
						break;
					case 'one-column-bottom-navbar':
						return 'bottom'
						break;
					case 'two-columns-left-sidebar':
					case 'two-columns-left-sidebar-large':
						return 'left';
						break;
					case 'two-columns-right-sidebar':
					case 'two-columns-right-sidebar-large':
						return 'right';
						break;
				}
			}
		},

		getNavbarSize: function() {
			if (this.isMobile()) {
				return 'small';
			} else {
				switch (this.options.layout) {
					case 'two-columns-left-sidebar':
					case 'two-columns-right-sidebar':
						return 'small';
						break;
					case 'two-columns-left-sidebar-large':
					case 'two-columns-right-sidebar-large':
						return 'large';
						break;
					default:
						return 'small';
				}
			}
		},

		getDocumentWidth: function() {
			return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		},

		getNumColumns: function() {
			if (this.options.layout && this.options.layout.indexOf('one') != -1 || this.getDocumentWidth() < 480) {
				return 1;
			} else {
				return 2;
			}
		},

		//
		// list formatting methods
		//

		setShowNumbering: function(showNumbering) {
			this.options.showNumbering = showNumbering;
			this.saveOptions();
		},

		setShowGrouping: function(showGrouping) {
			this.options.showGrouping = showGrouping;
			this.saveOptions();
		},

		setAutoRefresh: function(autoRefresh) {
			this.options.autoRefresh = autoRefresh;
			this.saveOptions();
		},

		//
		// startup methods
		//

		start: function() {

			// call superclass method
			//
			Marionette.Application.prototype.start.call(this);

			// call initializer
			//
			this.initialize();

			// initial render
			//
			this.render();

			// check web browser features supported
			//
			this.checkBrowserSupport();

			// check to see if user is logged in
			//
			this.relogin();
		},

		relogin: function() {
			var self = this;

			// get previously logged in user
			//
			this.session.getUser({

				// callbacks
				//
				success: function(user) {

					// set current user
					//
					self.session.user = user;

					// set server configuration info
					//
					Registry.application.config = user.get('config');
					user.unset('config', {
						silent: true
					});

					// start application
					//
					self.startRouters();
				},

				// session has expired
				//
				error: function(data, response) {

					// set current user
					//
					self.session.user = null;

					// set server configuration info
					//
					if (response.status != 500) {
						var json = JSON.parse(response.responseText);
						Registry.application.config = json.config;
					} else {
						Registry.application.config = {};
					}

					// start application
					//
					self.startRouters();
				}
			});
		},

		logout: function() {
			var self = this;
			require([
				'views/dialogs/error-view'
			], function (ErrorView) {

				// end session
				//
				self.session.logout({

					// callbacks
					//
					success: function() {

						// go to welcome view
						//
						Backbone.history.navigate('#', {
							trigger: true
						});
					},
					
					error: function(jqxhr, textstatus, errorThrown) {

						// show error dialog
						//
						self.modal.show(
							new ErrorView({
								message: "Could not log out: " + errorThrown + "."
							})
						);
					}
				});
			});
		},

		isLoggedIn: function() {
			return this.session.user != undefined;
		},

		//
		// rendering methods
		//

		render: function() {

			// render the template
			//
			$("body").html(this.template({}));

			this.onRender();
		},

		onRender: function() {
			var self = this;
			$(window).on('keydown', function(event) {
				self.onKeyPress(event);
			});
		},

		showPage: function(view, options) {
			this.main.show(
				new PageView({
					contentView: view,
					nav: options && options.nav? options.nav : undefined
				})
			);

			// store page content shown time
			//
			if (window.timing['page content shown'] == undefined) {
				window.timing['page content shown'] = new Date().getTime();
			}
		},

		showContent: function(options) {
			var self = this;
			require([
				'registry',
				'views/layout/one-column-view',
				'views/layout/two-columns-view'
			], function (Registry, OneColumnView, TwoColumnsView) {
				if (self.getNumColumns() == 1) {
					self.numColumns = 1;

					// show one column view
					//
					self.showPage(
						new OneColumnView({
							nav: options? options.nav2: 'home',
							model: options? options.model: undefined,
							done: options? options.done: undefined,
							navbarOrientation: self.getNavbarOrientation(),
							showChangeIcons: !self.isMobile()
						}), {
							nav: options? options.nav1: undefined
						}
					);
				} else {
					self.numColumns = 2;

					// show two columns view
					//
					self.showPage(
						new TwoColumnsView({
							nav: options? options.nav2: 'home',
							model: options? options.model: undefined,
							done: options? options.done: undefined,
							navbarOrientation: self.getNavbarOrientation(),
							navbarSize: self.getNavbarSize()
						}), {
							nav: options? options.nav1: undefined
						}
					);
				}
			});
		},

		showMain: function(view, options) {
			var self = this;
			require([
				'registry',
				'views/layout/main-view'
			], function (Registry, MainView) {
				if (Registry.application.session.user) {

					// user is logged in, show nav + content
					//
					Registry.application.showContent({
						nav1: options? options.nav : undefined,

						// callbacks
						//
						done: function(mainView) {
							mainView.content.show(view);
						}
					});
				} else {
					self.numColumns = undefined;

					// user is not logged in, show content only
					//
					self.showPage(
						new MainView({
							contentView: view
						}),
						options
					);
				}
			});
		},

		//
		// event handlers
		//

		onKeyPress: function(event) {

			// let modal handle key event
			//
			if (this.modal.isShowing()) {
				this.modal.onKeyPress(event);

			// let page handle key event
			//
			} else if (this.main.currentView && this.main.currentView.onKeyPress) {
				this.main.currentView.onKeyPress(event);
			}
		}
	});
});

