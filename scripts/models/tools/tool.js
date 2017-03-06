/******************************************************************************\
|                                                                              |
|                                       tool.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a software assessment tool.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'registry',
	'models/utilities/timestamped',
	'views/dialogs/error-view',
], function($, _, Config, Registry, Timestamped, ErrorView) {
	var Class = Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'tool_uuid',
		urlRoot: Config.servers.web + '/tools',

		//
		// querying methods
		//

		isOwned: function() {
			return this.get('is_owned');
		},
		
		isOwnedBy: function(user) {
			if (user && this.has('tool_owner')) {
				return user.get('user_uid') == this.get('tool_owner').user_uid;
			}
		},

		isDeactivated: function() {
			return (this.hasDeleteDate());
		},

		supports: function(packageTypeName) {
			if (this.has('package_type_names')) {
				var names = this.get('package_type_names');

				// check to see if package type is in list of names
				//
				var found = false;
				for (var i = 0; i < names.length; i++) {
					if (packageTypeName == names[i]) {
						return true;
						break;
					}
				}

				// not found in list
				//
				return false;
			} else {

				// no package type names attribute
				//
				return false;
			}
		},

		isCompatibleWith: function(viewer) {
			if (viewer) {
				var name = viewer.get('name').toLowerCase();
				for (var i = 0; i < this.viewer_names.length; i++) {
					if (this.viewer_names[i].toLowerCase() == name) {
						return true;
					}
				}
				return false;
			} else {
				return true;
			}
		},

		//
		// scoping methods
		//

		isPublic: function() {
			return this.has('tool_sharing_status') &&
				this.get('tool_sharing_status').toLowerCase() == 'public';
		},

		isPrivate: function() {
			return this.has('tool_sharing_status') &&
				this.get('tool_sharing_status').toLowerCase() == 'private';
		},

		isProtected: function() {
			return this.has('tool_sharing_status') &&
				this.get('tool_sharing_status').toLowerCase() == 'protected';
		},

		//
		// protection methods
		//

		isOpen: function() {
			return !this.has('policy_code');
		},

		isRestricted: function() {
			return this.has('policy_code');
		},

		//
		// ajax methods
		//

		fetchSharedProjects: function(options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + this.get('tool_uuid') + '/sharing',
				type: 'GET'
			}));
		},

		fetchPolicy: function(options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + this.get('tool_uuid') + '/policy',
				type: 'GET'
			}));
		},

		saveSharedProjects: function(projects, options) {
			$.ajax(_.extend(options, {
				url: this.urlRoot + '/' + this.get('tool_uuid') + '/sharing',
				type: 'PUT',
				dataType: 'JSON',
				data: {
					'projects': projects.toJSON()
				}
			}));
		},

		checkPermission: function(config) {
			$.ajax({
				url: this.urlRoot + '/' + this.get('tool_uuid') + '/permission',
				type: 'POST',
				dataType: 'JSON',
				data: {
					package_uuid: config.package_uuid,
					project_uid: config.project_uid
				},

				// callbacks
				//
				success: function(response) {
					config.approved(response);
				},

				error: function(response) {
					if (response.responseText.contains('{')) {
						response  = JSON.parse(response.responseText);
					}
					config.denied(response);
				}
			});
		},

		noToolPermission: function() {
			var self = this;
			require([
				'views/dialogs/confirm-view'
			], function (ConfirmView) {
				Registry.application.modal.show(
					new ConfirmView({
						title: 'Tool Permission Required',
						message: 'To use the "' + self.get('name') + '" tool, you are required to apply for permission.  Click "Ok" to navigate to your profile\'s permissions interface or "Cancel" to continue.',
						
						// callbacks
						//
						accept: function(){
							Backbone.history.navigate('#my-account/permissions', {
								trigger: true
							});
						}
					})
				);
			});
		},

		confirmToolPolicy: function(config) {
			var self = this;
			require([
				'views/policies/dialogs/accept-policy-view'
			], function (AcceptPolicyView) {
				Registry.application.modal.show(
					new AcceptPolicyView({
						title: self.get('name') + " Policy",
						message: "To use this tool you must first read and accept the following policy:",
						policy: config.policy,
						
						// callbacks
						//
						accept: function(){
							$.ajax({
								url: Config.servers.web + '/user_policies/' + config.policy_code + '/user/' + Registry.application.session.user.get('user_uid'),
								data: {
									accept_flag: 1
								},
								type: 'POST',
								dataType: 'JSON',

								// callbacks
								//
								success: function(response) {
									if( 'success' in config ){
										config.success( response );
									}
								},

								error: function(response) {
									if( 'error' in config ){
										config.error( response );
									}
								}
							});
						}
					}), {
						size: 'large'
					}
				);
			});
		},

		confirmToolPackage: function(config) {
		},

		confirmToolProject: function(config) {
			var self = this;
			require([
				'views/dialogs/confirm-view'
			], function (ConfirmView) {
				Registry.application.modal.show(
					new ConfirmView({
						title: 'Designate Tool Project',
						message: 'This project is not a designated "' + self.get('name') + '" project. ' + ( config.trial_project ? '' : ' If you wish to designate this project, be advised that project members may be able to create, schedule, and run assessments with "' + self.get('name') + '."  You will be held responsible for any abuse or usage contrary to the tool\'s EULA as project owner, so please vet and inform your project members. ' ) + ' Click "OK" to designate the project now.',
						
						// callbacks
						//
						accept: function() {
							$.ajax({
								url: Config.servers.web + '/user_permissions/' + config.user_permission_uid + '/project/' + config.project_uid,
								type: 'POST',
								dataType: 'JSON',

								// callbacks
								//
								success: function(response) {
									if ('success' in config) {
										config.success( response );
									}
								},

								error: function(response) {
									if ('error' in config) {
										config.error( response );
									}
								}
							});
						}
					})
				);
			});
		}
	}, {

		//
		// static methods
		//

		fetch: function(toolUuid, done) {

			// fetch tool
			//
			var tool = new Class({
				tool_uuid: toolUuid
			});

			tool.fetch({

				// callbacks
				//
				success: function() {
					done(tool);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch tool."
						})
					);
				}
			});
		}
	});

	return Class;
});
