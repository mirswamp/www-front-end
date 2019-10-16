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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'jquery.cookie',
	'config',
	'backbone',
	'marionette',
	'text!templates/layout/application.tpl',
	'routers/main-router',
	'routers/package-router',
	'routers/tool-router',
	'routers/platform-router',
	'routers/project-router',
	'routers/assessment-router',
	'routers/results-router',
	'routers/run-requests-router',
	'models/users/session',
	'views/layout/page-view',
	'views/layout/main-view',
	'views/dialogs/dialog-view',
	'views/keyboard/keyboard',
	'utilities/scripting/string-utils',
	'utilities/scripting/array-utils',
	'utilities/web/html-utils',
	'utilities/time/time-utils',
	'utilities/time/date-utils',
	'utilities/web/browser',
], function($, _, Cookie, Config, Backbone, Marionette, Template, MainRouter, PackageRouter, ToolRouter, PlatformRouter, ProjectRouter, AssessmentRouter, ResultsRouter, RunRequestsRouter, Session, PageView, MainView, DialogView, Keyboard, StringUtils, ArrayUtils, HTMLUtils, TimeUtils, DateUtils, Browser) {
	return Marionette.Application.extend({

		// attributes
		//
		template: _.template(Template),

		//
		// attributes
		//

		region: 'body',

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

			// initialize keyboard state
			//
			this.keyboard = new Keyboard({
				el: this.$el
			});

			// listen for keyboard events
			//
			this.listenTo(this.keyboard, 'keydown', this.onKeyDown);

			// in the event of a javascript error, reset the pending ajax spinner
			//
			$(window).on('error', function() {
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
			$(document).ajaxError(function(event, jqXHR) {
				if (self.session.user) {
					if (jqXHR.responseText === 'SESSION_INVALID') {
						self.sessionExpired();

						// prevent further handling of event
						//
						event.stopPropagation();
						event.preventDefault();
					} else if (jqXHR.status == 401) {
						data = JSON.parse(jqXHR.responseText);
						if (data.status == 'NO_SESSION') {
							self.sessionExpired();

							// prevent further handling of event
							//
							event.stopPropagation();
							event.preventDefault();			
						}
					}
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

			// load sounds
			//
			// this.createSounds();
		},

		//
		// sound methods
		//

		createSounds: function() {
			var self = this;
			require([
				'utilities/multimedia/sound'
			], function(Sound) {

				// create sounds
				//
				self.sounds = {
					'click': new Sound({
						url: 'sounds/click.wav'
					}),
					'double-click': new Sound({
						url: 'sounds/double-click.wav'
					})
				};
			});
		},
	
		//
		// routing methods
		//

		createRouters: function() {
			this.mainRouter = new MainRouter();
			this.packageRouter = new PackageRouter();
			this.toolRouter = new ToolRouter();
			this.platformRouter = new PlatformRouter();
			this.projectRouter = new ProjectRouter();
			this.assessmentRouter = new AssessmentRouter();
			this.resultsRouter = new ResultsRouter();
			this.runRequestsRouter = new RunRequestsRouter();

			this.routers = [
				this.mainRouter,
				this.packageRouter,
				this.toolRouter,
				this.platformRouter,
				this.projectRouter,
				this.assessmentRouter,
				this.resultsRouter,
				this.runRequestsRouter,
			];
		},

		startRouters: function() {
			var self = this;

			this.createRouters();

			// after any route change, clear modal dialogs
			//
			/*
			for (var i = 0; i < this.routers.length; i++) {
				this.routers[i].on("route", function(route, params) {
					if (self.modal.currentView) {
						self.modal.currentView.destroy();
					}
				});
			}
			*/

			if (!Backbone.history.start()) {
				this.mainRouter.showNotFound();
			}
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
			
			if (!Browser.supportsCors) {
				this.notify({
					message: "Sorry, your web browser does not support cross origin resources sharing.  You will need to upgrade your web browser to a newer version in order to use this application." +
						"<p>We suggest the following: " + browserList + "</p>"
				});
			} else if (!Browser.supportsHTTPRequestUploads) {
				this.notify({
					message: "Sorry, your web browser does not support the XMLHttpRequest2 object which is needed for uploading files.  You will need to upgrade your web browser to a newer version in order to upload files using this application." +
						"<p>We suggest the following: " + browserList + "</p>"
				});		
			} else if (!Browser.supportsFormData) {
				this.notify({
					message: "Sorry, your web browser does not support the FormData object which is needed for uploading files.  You will need to upgrade your web browser to a newer version in order to upload files using this application." +
						"<p>We suggest the following: " + browserList + "</p>"
				});			
			}
		},

		//
		// options / cookie methods
		//

		saveOptions: function() {

			// save options for later use
			//
			$.cookie(Config.cookie.name, JSON.stringify({
				layout: this.options.layout,
				showNumbering: this.options.showNumbering,
				showGrouping: this.options.showGrouping,
				autoRefresh: this.options.autoRefresh,
				authProvider: this.options.authProvider
			}), {

				// if not specified, the layout cookie will persist for 7 days
				//
				expires: Config.cookie.expires != 'undefined'? Config.cookie.expires : 7, 
				domain: Config.cookie.domain, 
				path: Config.cookie.path, 
				secure: Config.cookie.secure 
			});
		},

		loadOptions: function() {

			// load options from cookie
			//
			var cookie = $.cookie(Config.cookie.name);
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
			return (
				navigator.userAgent.match(/Android/i) ||
				navigator.userAgent.match(/webOS/i) ||
				navigator.userAgent.match(/iPhone/i) ||
				navigator.userAgent.match(/iPad/i) ||
				navigator.userAgent.match(/iPod/i) ||
				navigator.userAgent.match(/BlackBerry/i) ||
				navigator.userAgent.match(/Windows Phone/i)
			);
		},

		//
		// layout methods
		//

		getLayout: function() {
			if (this.isMobile()) {
				return 'one-column-bottom-navbar';
			} else {
				return this.options.layout;
			}
		},

		setLayout: function(layout) {
			this.options.layout = layout;
			this.saveOptions();
		},

		getLayoutOrientation: function(layout) {
			switch (layout) {
				case 'one-column-top-navbar':
					return 'top';
				case 'one-column-bottom-navbar':
					return 'bottom';
				case 'two-columns-left-sidebar':
				case 'two-columns-left-sidebar-large':
					return 'left';
				case 'two-columns-right-sidebar':
				case 'two-columns-right-sidebar-large':
					return 'right';
				default:
					return 'left';
			}
		},

		getNavbarSize: function(layout) {			
			switch (layout) {
				case 'two-columns-left-sidebar':
				case 'two-columns-right-sidebar':
					return 'small';
				case 'two-columns-left-sidebar-large':
				case 'two-columns-right-sidebar-large':
					return 'large';
				default:
					return 'small';
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
					self.config = user.get('config');
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
					if (response.status == 401) {
						var json = JSON.parse(response.responseText);
						self.config = json.config;
					} else {
						self.config = {};
					}

					// start application
					//
					self.startRouters();
				}
			});
		},

		logout: function() {
			var self = this;

			// end session
			//
			this.session.logout({

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

					// show error message
					//
					self.error({
						message: "Could not log out: " + errorThrown + "."
					});
				}
			});
		},

		isLoggedIn: function() {
			return this.session.user != undefined;
		},

		/*
		sessionExpired: function() {
			this.notify({
				message: "Sorry, your session has expired, please log in again to continue using the SWAMP.",
				
				// callbacks
				//
				accept: function() {
					application.session.logout({

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
			});
		},
		*/

		setUser: function(user) {

			// set attributes
			//
			this.session.user = user;

			// update header
			//
			this.getView().getChildView('header').render();
		},

		sessionExpired: function() {
			var self = this;

			// check if we are already signing in
			//
			if (this.signingIn) {
				return;
			} else {
				this.signingIn = true;
			}

			require([
				'views/users/authentication/dialogs/sign-in-dialog-view'
			], function (SignInDialogView) {

				// show sign in dialog
				//
				self.show(new SignInDialogView(), {
					focus: '#ok'
				});
			});
		},

		//
		// rendering methods
		//

		render: function() {

			// render the template
			//
			$("body").html(this.template({}));
		},

		show: function(view, options) {
			if (view instanceof DialogView) {

				// show modal dialog
				//
				view.show(options);
			} else {

				// show main view
				//
				this.showPage(new MainView({
					contentView: view
				}));
			}
		},

		showPage: function(view, options) {
			var pageView = new PageView({
				contentView: view,
				nav: options && options.nav? options.nav : undefined
			});

			this.showView(pageView);

			// add class for full (non-scrolling) pages
			//
			if (options && options.full) {
				pageView.$el.addClass('full');
			}

			// store page content shown time
			//
			if (window.timing['page content shown'] == undefined) {
				window.timing['page content shown'] = new Date().getTime();
			}
		},

		showContent: function(options) {
			var self = this;
			require([
				'views/layout/multi-column-view'
			], function (MultiColumnView) {
				var layout = self.getLayout();

				// show multi column view
				//
				self.showPage(
					new MultiColumnView({
						nav: options? options.nav2: 'home',
						model: options? options.model: undefined,
						done: options? options.done: undefined,
						navbarOrientation: self.getLayoutOrientation(layout),
						navbarSize: self.getNavbarSize(layout)
					}), {
						nav: options? options.nav1: undefined,
						full: options.full
					}
				);
			});
		},

		showMain: function(view, options) {	
			var self = this;
			require([
				'views/layout/main-view'
			], function (MainView) {
				if (self.session.user) {

					// user is logged in, show nav + content
					//
					self.showContent({
						nav1: options? options.nav : undefined,
						nav2: options? options.nav2 : undefined,
						full: options? options.full : undefined,

						// callbacks
						//
						done: function(mainView) {
							mainView.showChildView('content', view);
						}
					});
				} else {
					// self.numColumns = undefined;

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
		// dialog methods
		//

		notify: function(options) {
			var self = this;
			require([
				'views/dialogs/notify-dialog-view'
			], function(NotifyDialogView) {

				// show notify dialog
				//
				self.show(new NotifyDialogView(options));
			});
		},

		confirm: function(options) {
			var self = this;
			require([
				'views/dialogs/confirm-dialog-view'
			], function(ConfirmDialogView) {

				// show confirm dialog
				//
				self.show(new ConfirmDialogView(options));
			});
		},

		error: function(options) {
			var self = this;

			// wait a moment for application to handle error
			//
			window.setTimeout(function() {

				// check if we are already signing in
				//
				if (self.signingIn) {
					return;
				}

				require([
					'views/dialogs/error-dialog-view'
				], function(ErrorDialogView) {

					// show error dialog
					//
					self.show(new ErrorDialogView(options));
				});
			}, 100);
		},

		getActiveView: function() {

			// get current dialog
			//
			if (DialogView.dialogs.length > 0) {
				return DialogView.dialogs[DialogView.dialogs.length - 1];
			}

			// get main view
			//
			var view = this.getView();
			if (view && view.hasChildView('main')) {
				view = view.getChildView('main');
			}

			return view;
		},

		//
		// event handlers
		//

		onKeyDown: function(event) {
			var activeView = this.getActiveView();

			// let active view handle event
			//
			if (activeView && activeView.onKeyDown) {
				activeView.onKeyDown(event);
			}
		}
	});
});

