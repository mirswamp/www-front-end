/******************************************************************************\
|                                                                              |
|                                   session.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level application specific class.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'jquery.cookie',
	'config',
	'registry',
	'models/users/user',
	'views/dialogs/error-view',
	'utilities/browser/url-strings'
], function($, _, Backbone, Cookie, Config, Registry, User, ErrorView) {
	return Backbone.Model.extend({

		//
		// login methods
		//

		login: function(username, password, options) {
			
			// initialize the web server session
			//
			$.ajax(Config.servers.web + '/login', _.extend(options, {
				type:'POST',
				dataType:'json',
				data: { 
					username: username,
					password: password
				}
			}));
		},

		getUser: function(options) {
			var self = this;

			// create new user
			//
			this.user = new User({
				user_uid: 'current'
			});

			// fetch the user using the rws server session
			//
			this.user.fetch({
				global: false,

				// callbacks
				//
				success: function() {
					if (options.success) {
						options.success(self.user);
					}
				},

				error: function(response, statusText, errorThrown) {
					if (options.error) {
						options.error(response, statusText, errorThrown);
					}
				}
			});
		},

		logout: function(options) {

			// delete session information
			//
			$.removeCookie(Config.cookie.name, { path: '/', domain: Config.cookie.domain });

			// delete local user info
			//
			this.user = null;

			// close web server session
			//
			$.ajax(Config.servers.web + '/logout', _.extend(options, {
				type: 'POST',

				// callbacks
				//
				error: function(jqxhr, textStatus, errorThrown) {

					// show error dialog view
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not log out: " + errorThrown + "."
						})
					);
				}
			}));
		},

		isLoggedIn: function() {
			return this.user ? true : false;
		},

		isAdmin: function() {
			return this.isLoggedIn() && this.user.isAdmin();
		}
	}, {

		//
		// static methods
		//

		linkedAccountRedirect: function(provider) {

			// save auth provider
			//
			if (provider) {
				Registry.application.options.authProvider = provider.get('name');
				Registry.application.saveOptions();
			}

			// redirect
			//
			window.location = Config.servers.web + '/oauth2/redirect' +
				((provider === undefined) ? '' : ('?entityid=' + urlEncode(provider.get('entityid'))));
		},

		linkedAccountLogin: function(options) {
			window.location = Config.servers.web + '/oauth2/redirect';
		},

		fetchStatus: function(options) {
			return $.ajax(Config.servers.web + '/status', options);
		}
	});
});

