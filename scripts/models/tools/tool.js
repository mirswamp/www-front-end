/******************************************************************************\
|                                                                              |
|                                   tool.js                                    |
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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/utilities/timestamped',
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

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
			return typeof delete_date !== 'undefined';
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
				if (this.viewer_names) {
					for (var i = 0; i < this.viewer_names.length; i++) {
						if (this.viewer_names[i].toLowerCase() == name) {
							return true;
						}
					}
				}
				return false;
			} else {
				return true;
			}
		},

		getAppUrl: function() {
			return application.getURL() + '#tools/' + this.get('tool_uuid');
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

		confirmPolicy: function(options) {
			var self = this;

			// fetch tool policy text
			//
			this.fetchPolicy({

				// callbacks
				//
				success: function(policy) {

					// show confirm tool policy dialog
					//
					self.confirmToolPolicy({
						policy_code: self.get('policy_code'),
						policy: policy,

						// callbacks
						//
						success: function() {

							// perform callback
							//
							if (options && options.success) {
								options.success();
							}
						},

						reject: function() {

							// perform callback
							//
							if (options && options.reject) {
								options.reject();
							}		
						},

						error: function(response) {

							// show error message
							//
							application.error({
								message: "Error saving policy acknowledgement."
							});
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch tool policy."
					});
				}
			});
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

		checkPermission: function(options) {
			$.ajax({
				url: this.urlRoot + '/' + this.get('tool_uuid') + '/permission',
				type: 'POST',
				dataType: 'JSON',
				data: {
					package_uuid: options.package_uuid,
					project_uid: options.project_uid
				},

				// callbacks
				//
				success: function(response) {
					if (response.status == 'approved' || response.status == 'granted') {
						options.approved(response);
					} else {
						options.denied(response);
					}
				},

				error: function(response) {
					if (response.responseText.contains('{')) {
						response  = JSON.parse(response.responseText);
					}
					options.denied(response);
				}
			});
		},

		noToolPermission: function() {

			// show confirmation
			//
			application.confirm({
				title: 'Tool Permission Required',
				message: 'To use the "' + this.get('name') + '" tool, you are required to apply for permission.  Click "Ok" to navigate to your profile\'s permissions interface or "Cancel" to continue.',
				
				// callbacks
				//
				accept: function() {
					application.navigate('#my-account/permissions');
				}
			});
		},

		confirmToolPolicy: function(options) {
			var self = this;
			require([
				'views/policies/dialogs/accept-policy-dialog-view'
			], function (AcceptPolicyDialogView) {
				application.show(new AcceptPolicyDialogView({
					title: self.get('name') + " Policy",
					message: "To use this tool you must first read and accept the following policy:",
					policy: options.policy,
					
					// callbacks
					//
					accept: function() {
						$.ajax({
							url: Config.servers.web + '/user_policies/' + options.policy_code + '/user/' + application.session.user.get('user_uid'),
							data: {
								accept_flag: 1
							},
							type: 'POST',
							dataType: 'JSON',

							// callbacks
							//
							success: function(response) {

								// perform callback
								//
								if (options && options.success) {
									options.success(response);
								}
							},

							error: function(response) {

								// perform callback
								//
								if (options && options.error) {
									options.error(response);
								}
							}
						});
					},

					reject: function() {

						// perform callback
						//
						if (options && options.reject) {
							options.reject();
						}
					}
				}), {
					size: 'large'
				});
			});
		},

		confirmToolPackage: function(options) {
		},

		confirmToolProject: function(options) {
			var self = this;
			require([
						], function (ConfirmDialogView) {

				// show confirmation
				//
				application.confirm({
					title: 'Designate Tool Project',
					message: 'This project is not a designated "' + self.get('name') + '" project. ' + (options.trial_project ? '' : ' If you wish to designate this project, be advised that project members may be able to create, schedule, and run assessments with "' + self.get('name') + '."  You will be held responsible for any abuse or usage contrary to the tool\'s EULA as project owner, so please vet and inform your project members. ' ) + ' Click "OK" to designate the project now.',
					
					// callbacks
					//
					accept: function() {
						$.ajax({
							url: Config.servers.web + '/user_permissions/' + options.user_permission_uid + '/project/' + options.project_uid,
							type: 'POST',
							dataType: 'JSON',

							// callbacks
							//
							success: function(response) {

								// perform callback
								//
								if (options && options.success) {
									options.success(response);
								}
							},

							error: function(response) {

								// perform callback
								//
								if (options && options.error) {
									options.error(response);
								}
							}
						});
					}
				});
			});
		}
	}, {

		//
		// static methods
		//

		fetch: function(toolUuid, done) {

			// fetch tool
			//
			var tool = new this.prototype.constructor({
				tool_uuid: toolUuid
			});

			tool.fetch({

				// callbacks
				//
				success: function(model) {
					done(model);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch tool."
					});
				}
			});
		}
	});
});
